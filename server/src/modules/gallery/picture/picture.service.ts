import { Injectable } from '@nestjs/common'
import { extname } from 'node:path'
import { BusinessException } from '@shared/custom-exception'
import { BusinessStatus } from '@core/config'
import type { Request } from 'express'
import { PrismaService } from '@core/prisma/prisma.service'
import { OssService } from '@infra/oss/oss.service'
import { LoginVoModel } from '@identity/user/vo'
import { UserRole } from '@identity/user/enum/user'
import { Picture } from './entities/picture.entity'
import { ReviewStatus } from './enum'
import { Prisma, UserActionStatus } from '@prisma/client'
import { ShowPictureModelVo, PictureVoModel, GetPictureVoModel, UploadPictureVoModel } from './vo'
import { RedisCacheService } from '@core/cache/cache.service'
import { SpaceService } from '@space/core/space.service'
import { hexToRgb, euclideanDistance, normalizeDistance } from '@shared/utils'
import {
    CreatePictureViewDto,
    EditPictureByBatchDto,
    PartialQueryPictureDto,
    QueryPictureDto,
    UploadBatchPictureDto,
    UpdatePictureDto,
    UploadPictureDto,
    DeletePictureDto,
    ReviewPictureDto,
    UploadPictureUrlDto,
    AiExpandPictureDto,
    DeleteBatchPictureDto
} from './dto'
import { AiService } from '@infra/ai/ai.service'
import { SpaceUserAuthManager } from '@identity/permission/SpaceUserAuthManager'
import { SpaceUserPermissionConstant } from '@identity/permission/SpaceUserPermissionConstant'
import { Space } from '@space/core/entities/space.entity'
import { PermissionGuard } from '@identity/permission/permission.guard'
import { PERMISSION_KEY } from '@identity/permission/permission.decorator'
import { AiGeneratePictureDto } from '@infra/ai/dto'
import { RedisService } from '@core/redis/redis.service'
import { TagService } from '@gallery/tag/tag.service'
import { MessageService } from '@tools/message/message.service'
import { MessageType } from '@tools/message/enum'
import 'multer'

const PICTURE_VIEW_DEDUP_TTL_SECONDS = 30 * 60

@Injectable()
export class PictureService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ossService: OssService,
        private readonly redisCacheService: RedisCacheService,
        private readonly spaceService: SpaceService,
        private readonly aiService: AiService,
        private readonly spaceUserAuthManager: SpaceUserAuthManager,
        private readonly permissionGuard: PermissionGuard,
        private readonly redisService: RedisService,
        private readonly tagService: TagService,
        private readonly messageService: MessageService
    ) {}

    private async getAccessiblePictureOrThrow(id: string, req: Request) {
        const picture = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!picture) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }

        const loginUser = req.session?.user
        if (picture.spaceId !== null) {
            if (!loginUser || !loginUser.id) {
                throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
            }
            const hasPermission = await this.permissionGuard.hasPermission(loginUser.id, PERMISSION_KEY, req, [
                SpaceUserPermissionConstant.PICTURE_VIEW
            ])
            if (!hasPermission) {
                throw new BusinessException('无权限查看', BusinessStatus.NOT_AUTH_ERROR.code)
            }
        }

        return picture
    }

    async getPictureByPage(queryPictureDto: QueryPictureDto) {
        const { current, pageSize, searchText, ...filters } = queryPictureDto

        // Build where clause for search and filters
        const where: any = {
            reviewStatus: {
                not: ReviewStatus.REJECT // ReviewStatus.PASS
            },
            ...(searchText && {
                OR: [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
            }),
            ...(filters.nullSpaceId ? { spaceId: null } : {}),
            ...Object.entries(filters).reduce((acc: any, [key, value]) => {
                if (
                    value !== undefined &&
                    key !== 'sortField' &&
                    key !== 'sortOrder' &&
                    key !== 'reviewStatus' &&
                    key !== 'nullSpaceId'
                ) {
                    if (key === 'tags' && Array.isArray(value)) {
                        acc[key] = {
                            contains: value.map(tag => `"${tag}"`).join(',')
                        }
                    } else {
                        acc[key] = value
                    }
                }
                return acc
            }, {})
        }
        const orderBy: any = filters.sortField
            ? {
                  [filters.sortField]: filters.sortOrder || 'desc'
              }
            : undefined

        // Get paginated results and total count in parallel
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where,
                orderBy,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.picture.count({ where })
        ])
        const result: PictureVoModel[] = data.map(item => ({
            id: item.id,
            url: item.url,
            name: item.name,
            introduction: item.introduction,
            category: item.category,
            tags: item.tags === '' ? '' : JSON.parse(item.tags) || [],
            picSize: Number(item.picSize),
            picWidth: item.picWidth,
            picHeight: item.picHeight,
            picScale: item.picScale,
            picColor: item.picColor,
            picFormat: item.picFormat,
            createTime: item.createTime.toISOString(),
            userId: item.userId,
            spaceId: item.spaceId,
            editTime: item.editTime.toISOString(),
            reviewStatus: item.reviewStatus,
            reviewTime: item.reviewTime.toISOString(),
            reviewMessage: item.reviewMessage
        }))
        return {
            list: result,
            total
        }
    }

    async getPictureByPageVo(queryPictureDto: QueryPictureDto, req: Request) {
        const {
            current,
            pageSize,
            searchText,
            startEditTime,
            endEditTime,
            queryMyLike,
            queryMyCollection,
            ...filters
        } = queryPictureDto
        if (Number(pageSize) > 20) {
            throw new BusinessException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }
        if (queryMyLike && queryMyCollection) {
            throw new BusinessException('不能同时查询我的点赞和我的收藏', BusinessStatus.PARAMS_ERROR.code)
        }
        if (!filters.spaceId) {
            filters.reviewStatus = 1
            filters.nullSpaceId = true
        } else {
            const user = req.session?.user
            if (!user || !user.id) {
                throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
            }
            await this.ensureSpacePermission(filters.spaceId, user, SpaceUserPermissionConstant.PICTURE_VIEW)
        }
        // const cacheKey = `picture_page_${current}_${pageSize}`
        // const cacheData = await this.redisCacheService.get<ShowPictureModelVo[]>(cacheKey)
        // const isQuery = !searchText && !filters.category && filters.tags && filters.tags.length === 0
        // if (cacheData && isQuery) {
        //     return cacheData
        // }
        // Build where clause for search and filters

        const where: Prisma.pictureWhereInput = {
            ...(searchText && {
                OR: [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
            }),
            ...(startEditTime && endEditTime ? { editTime: { gt: startEditTime, lt: endEditTime } } : {}),
            reviewStatus: filters.spaceId ? undefined : 1,
            ...(filters.spaceId ? { spaceId: filters.spaceId } : {}),
            ...(filters.nullSpaceId ? { spaceId: null } : {}),
            ...Object.entries(filters).reduce((acc: any, [key, value]) => {
                if (
                    value !== undefined &&
                    key !== 'sortField' &&
                    key !== 'sortOrder' &&
                    key !== 'reviewStatus' &&
                    key !== 'spaceId' &&
                    key !== 'nullSpaceId' &&
                    key !== 'editTime'
                ) {
                    if (key === 'tags' && Array.isArray(value)) {
                        acc[key] = {
                            contains: value.map(tag => `"${tag}"`).join(',')
                        }
                    } else {
                        acc[key] = value
                    }
                }
                return acc
            }, {})
        }
        const orderBy: any = filters.sortField
            ? {
                  [filters.sortField]: filters.sortOrder || 'desc'
              }
            : undefined

        const buildShowPicture = (item: any): ShowPictureModelVo => ({
            id: item.id,
            url: item.url,
            introduction: item.introduction,
            category: item.category,
            tags: item.tags === '' ? [] : JSON.parse(item.tags) || [],
            format: item.picFormat,
            fileSize: item.picSize,
            width: item.picWidth,
            height: item.picHeight,
            filename: item.name,
            picScale: item.picScale,
            thumbnailUrl: item.thumbnailUrl,
            color: item.picColor,
            viewNumber: item.viewNumber,
            likeNumber: item.likeNumber,
            downloadNumber: item.downloadNumber,
            collectionNumber: item.collectionNumber
        })

        if (queryMyLike || queryMyCollection) {
            const loginUser = req.session?.user
            if (!loginUser?.id) {
                throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
            }

            const actionWhere = {
                userId: loginUser.id,
                status: UserActionStatus.ACTIVE,
                isDelete: 0
            }

            const actionRecords = queryMyLike
                ? await this.prismaService.picture_like.findMany({
                      where: actionWhere,
                      orderBy: { createTime: 'desc' },
                      select: { pictureId: true }
                  })
                : await this.prismaService.picture_favorite.findMany({
                      where: actionWhere,
                      orderBy: { createTime: 'desc' },
                      select: { pictureId: true }
                  })

            const orderedPictureIds = actionRecords.map(item => item.pictureId)
            if (orderedPictureIds.length === 0) {
                return {
                    list: [],
                    total: 0
                }
            }

            const accessiblePictures = await this.prismaService.picture.findMany({
                where: {
                    ...where,
                    id: { in: orderedPictureIds }
                },
                select: { id: true }
            })

            const accessibleIdSet = new Set(accessiblePictures.map(item => item.id))
            const filteredOrderedIds = orderedPictureIds.filter(id => accessibleIdSet.has(id))
            const skip = (Number(current) - 1) * Number(pageSize)
            const take = Number(pageSize)
            const pagePictureIds = filteredOrderedIds.slice(skip, skip + take)

            if (pagePictureIds.length === 0) {
                return {
                    list: [],
                    total: filteredOrderedIds.length
                }
            }

            const pagePictures = await this.prismaService.picture.findMany({
                where: {
                    ...where,
                    id: { in: pagePictureIds }
                }
            })

            const pictureMap = new Map(pagePictures.map(item => [item.id, item]))
            const result = pagePictureIds
                .map(id => pictureMap.get(id))
                .filter((item): item is (typeof pagePictures)[number] => !!item)
                .map(buildShowPicture)

            return {
                list: result,
                total: filteredOrderedIds.length
            }
        }

        // Get paginated results and total count in parallel
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where,
                orderBy,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.picture.count({ where })
        ])
        const result: ShowPictureModelVo[] = data.map(buildShowPicture)
        // if (result.length > 0) {
        //     await this.redisCacheService.set(
        //         cacheKey,
        //         {
        //             list: result,
        //             total
        //         },
        //         3600000
        //     )
        // }
        return {
            list: result,
            total
        }
    }

    async getById(id: string, returnUser: boolean = true) {
        const result = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!result) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        const obj: GetPictureVoModel = {
            id: result.id,
            url: result.url,
            name: result.name,
            introduction: result.introduction,
            category: result.category,
            tags: result.tags === '' ? '' : JSON.parse(result.tags) || [],
            picSize: Number(result.picSize),
            picWidth: result.picWidth,
            picHeight: result.picHeight,
            picScale: result.picScale,
            picFormat: result.picFormat,
            viewNumber: result.viewNumber ?? 0,
            createTime: result.createTime.toISOString(),
            spaceId: result.spaceId,
            editTime: result.editTime.toISOString()
        }
        if (returnUser) {
            return {
                ...obj,
                user: {
                    id: user?.id,
                    userAccount: user?.userAccount,
                    userName: user?.userName,
                    userAvatar: user?.userAvatar,
                    userProfile: user?.userProfile,
                    userRole: user?.userRole
                } as LoginVoModel
            } as GetPictureVoModel
        } else {
            return obj
        }
    }

    async getByIds(ids: string[]) {
        const result = await this.prismaService.picture.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        if (result.length === 0) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: result.map(item => item.userId)
                }
            }
        })
        return result.map(item => {
            const user = users.find(user => user.id === item.userId)
            return {
                id: item.id,
                url: item.url,
                name: item.name,
                introduction: item.introduction,
                category: item.category,
                tags: item.tags === '' ? '' : JSON.parse(item.tags) || [],
                picSize: Number(item.picSize),
                picWidth: item.picWidth,
                picHeight: item.picHeight,
                picScale: item.picScale,
                picFormat: item.picFormat,
                createTime: item.createTime.toISOString(),
                userId: item.userId,
                spaceId: item.spaceId,
                editTime: item.editTime.toISOString(),
                user: {
                    id: user?.id,
                    userAccount: user?.userAccount,
                    userName: user?.userName,
                    userAvatar: user?.userAvatar,
                    userProfile: user?.userProfile,
                    userRole: user?.userRole
                } as LoginVoModel
            }
        })
    }

    async getByIdVo(id: string, req: Request) {
        const result = await this.getAccessiblePictureOrThrow(id, req)
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        const [collectionPicture, likePicture] = await Promise.all([
            this.prismaService.picture_favorite.findFirst({
                where: {
                    pictureId: id,
                    userId: req.session.user.id,
                    status: UserActionStatus.ACTIVE,
                    isDelete: 0
                }
            }),
            this.prismaService.picture_like.findFirst({
                where: {
                    pictureId: id,
                    userId: req.session.user.id,
                    status: UserActionStatus.ACTIVE,
                    isDelete: 0
                }
            })
        ])
        // 获取权限列表
        const loginUser = req.session?.user
        const spaceId = result.spaceId
        let space: Space | null = null
        if (spaceId !== null) {
            space = await this.spaceService.getById(result.spaceId)
        }
        const permissionList = await this.spaceUserAuthManager.getPermissionList(space, loginUser)
        return {
            id: result.id,
            url: result.url,
            name: result.name,
            introduction: result.introduction,
            category: result.category,
            tags: result.tags === '' ? [] : JSON.parse(result.tags) || [],
            picSize: Number(result.picSize),
            picWidth: result.picWidth,
            picHeight: result.picHeight,
            picScale: result.picScale,
            picFormat: result.picFormat,
            picColor: result.picColor,
            viewNumber: result.viewNumber ?? 0,
            createTime: result.createTime.toISOString(),
            permissions: permissionList,
            user: {
                id: user?.id,
                userAccount: user?.userAccount,
                userName: user?.userName,
                userAvatar: user?.userAvatar,
                userProfile: user?.userProfile,
                userRole: user?.userRole
            },
            spaceId: result.spaceId,
            editTime: result.editTime.toISOString(),
            thumbnailUrl: result.thumbnailUrl,
            isLike: !!likePicture,
            isCollect: !!collectionPicture
        } as GetPictureVoModel
    }

    async recordPictureView(createPictureViewDto: CreatePictureViewDto, req: Request) {
        const user = req.session?.user
        if (!user?.id) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }

        const { pictureId } = createPictureViewDto
        await this.getAccessiblePictureOrThrow(pictureId, req)

        const dedupKey = `picture:view:${pictureId}:user:${user.id}`
        const setResult = await this.redisService.getClient().set(dedupKey, '1', {
            EX: PICTURE_VIEW_DEDUP_TTL_SECONDS,
            NX: true
        })

        if (setResult !== 'OK') {
            return false
        }

        await this.prismaService.picture.update({
            where: {
                id: pictureId
            },
            data: {
                viewNumber: {
                    increment: 1
                }
            }
        })

        return true
    }

    async delete(deletePicture: DeletePictureDto, req: Request) {
        const { id } = deletePicture
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const oldPicture = await this.getById(id)
        if (!oldPicture) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        await this.checkPictureAuth(user, oldPicture, SpaceUserPermissionConstant.PICTURE_DELETE)
        const result = await this.prismaService.picture.delete({
            where: { id }
        })
        if (!result) {
            throw new BusinessException('图片删除失败', BusinessStatus.OPERATION_ERROR.code)
        }
        const spaceId = oldPicture.spaceId
        if (spaceId) {
            this.prismaService.$transaction(async prisma => {
                const space = await prisma.space.update({
                    where: {
                        id: spaceId
                    },
                    data: {
                        totalCount: {
                            decrement: 1
                        },
                        totalSize: {
                            decrement: BigInt(oldPicture.picSize)
                        }
                    }
                })
                if (!space) {
                    throw new BusinessException('空间更新失败', BusinessStatus.OPERATION_ERROR.code)
                }
            })
        }
        this.redisCacheService.clear()
        return true
    }

    async uploadFile(
        file: Express.Multer.File | string,
        req: Request,
        uploadPictureDto?: UploadPictureDto | UploadPictureUrlDto
    ) {
        if (typeof file === 'string') {
            if (file.length > 1024) {
                throw new BusinessException('图片链接过长', BusinessStatus.OPERATION_ERROR.code)
            }
        } else {
            this.validatePicture(file)
        }
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        let spaceId = uploadPictureDto?.spaceId
        if (spaceId) {
            const space = await this.spaceService.getById(spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            // if (space.userId !== user.id) {
            //     throw new BusinessException('仅限本人空间使用', BusinessStatus.NOT_AUTH_ERROR.code)
            // }
            if (space.totalCount >= space.maxCount) {
                throw new BusinessException('空间已满', BusinessStatus.OPERATION_ERROR.code)
            }
            if (space.totalSize >= space.maxSize) {
                throw new BusinessException('空间条数不足', BusinessStatus.OPERATION_ERROR.code)
            }
        }
        let pictureId: string | undefined = undefined
        let oldPicture: Picture | undefined = undefined
        if (uploadPictureDto && uploadPictureDto.id) {
            pictureId = uploadPictureDto.id
            // 判断图片是否存在
            oldPicture = await this.prismaService.picture.findUnique({
                where: {
                    id: pictureId
                }
            })
            if (!oldPicture) {
                throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
            }
            if (!spaceId) {
                if (oldPicture.spaceId) {
                    spaceId = oldPicture.spaceId
                }
            } else {
                if (oldPicture.spaceId !== spaceId) {
                    throw new BusinessException('图片空间不匹配', BusinessStatus.OPERATION_ERROR.code)
                }
            }
            // if (oldPicture.userId !== user.id && user.userRole !== UserRole.ADMIN) {
            //     throw new BusinessException('仅限本人或管理员修改', BusinessStatus.OPERATION_ERROR.code)
            // }
        }
        // 上传图片
        const name = typeof file === 'string' ? file : file.originalname
        const buffer = typeof file === 'string' ? null : file.buffer
        const ossResult = await this.ossService.uploadFile(name, buffer, spaceId ? 'space' : 'public')
        const reviewStatus = user.userRole === UserRole.ADMIN ? 1 : 0
        const reviewTime = user.userRole === UserRole.ADMIN ? new Date() : undefined
        let picture: Picture
        let tags: string[] = [] // 初始化为空数组防卫
        if (pictureId) {
            picture = await this.prismaService.picture.update({
                where: {
                    id: pictureId
                },
                data: {
                    url: ossResult.url,
                    picScale: ossResult.picScale,
                    picSize: BigInt(ossResult.fileSize),
                    picFormat: ossResult.format,
                    picWidth: Number(ossResult.width),
                    picHeight: Number(ossResult.height),
                    picColor: ossResult.color,
                    name: ossResult.filename,
                    editTime: new Date(),
                    userId: user?.id || '',
                    spaceId,
                    reviewStatus,
                    reviewTime,
                    thumbnailUrl: ossResult.thumbnailUrl
                    // 移除了 tags: '' 的手误，防止破坏已有标签数据库
                }
            })
            // 补充回原有的 Tags 到返回对象中防止前端解析失败
            try {
                if (picture.tags) {
                    tags = JSON.parse(picture.tags)
                }
            } catch (e) {
                tags = []
            }
        } else {
            const tags: string[] = [] // 移除原来调用 AI 和将 tags 入库的代码，将提取过程交由前端手动触发

            picture = await this.prismaService.picture.create({
                data: {
                    url: ossResult.url,
                    picScale: ossResult.picScale,
                    picSize: BigInt(ossResult.fileSize),
                    picFormat: ossResult.format,
                    picWidth: Number(ossResult.width),
                    picHeight: Number(ossResult.height),
                    picColor: ossResult.color,
                    name: ossResult.filename,
                    userId: user?.id || '',
                    spaceId,
                    tags: JSON.stringify(tags),
                    category: '',
                    introduction: '',
                    thumbnailUrl: ossResult.thumbnailUrl
                }
            })
        }
        if (!picture) {
            throw new BusinessException('图片上传失败', BusinessStatus.OPERATION_ERROR.code)
        }
        if (spaceId) {
            const oldSpace = await this.prismaService.space.findUnique({ where: { id: spaceId } })
            if (!oldSpace) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            await this.prismaService.$transaction(async prisma => {
                const space = await prisma.space.update({
                    where: {
                        id: spaceId
                    },
                    data: {
                        totalCount: pictureId
                            ? oldSpace.totalCount
                            : {
                                  increment: 1
                              },
                        totalSize: pictureId
                            ? {
                                  set: oldSpace.totalSize - BigInt(oldPicture.picSize) + BigInt(picture.picSize)
                              }
                            : {
                                  increment: BigInt(picture.picSize)
                              }
                    }
                })
                if (!space) {
                    throw new BusinessException('空间更新失败', BusinessStatus.OPERATION_ERROR.code)
                }
            })
        }
        return {
            id: picture.id,
            url: picture.url,
            picScale: picture.picScale,
            format: picture.picFormat,
            fileSize: picture.picSize,
            width: picture.picWidth,
            height: picture.picHeight,
            filename: picture.name,
            thumbnailUrl: picture.thumbnailUrl,
            spaceId: picture.spaceId,
            color: picture.picColor
        } as UploadPictureVoModel
    }

    async getPictureTags() {
        const pictureTags = await this.tagService.getPictureTags()
        return pictureTags.map(tag => tag.tagName)
    }

    validatePicture(file: Express.Multer.File) {
        if (!file) {
            throw new BusinessException('图片不能为空', BusinessStatus.OPERATION_ERROR.code)
        }
        const ext = extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.webp') {
            throw new BusinessException('图片格式错误', BusinessStatus.OPERATION_ERROR.code)
        }
        const maxSize = 2 * 1024 * 1024 // 2MB in bytes
        if (file.size > maxSize) {
            throw new BusinessException('图片大小不能超过2M', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    // 修改图片信息(管理员使用)
    async update(updatePictureDto: UpdatePictureDto, req: Request) {
        const user = req.session.user
        const { id, ...rest } = updatePictureDto
        const oldPicture = await this.getById(id)
        this.validPicture(oldPicture)
        const result = await this.prismaService.picture.update({
            where: { id },
            data: {
                ...rest,
                tags: JSON.stringify(rest.tags),
                reviewStatus: 1,
                reviewTime: new Date(),
                reviewerId: user.id
            }
        })
        if (!result) {
            throw new BusinessException('图片更新失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    // 修改图片信息(用户使用)
    async edit(updatePictureDto: UpdatePictureDto, req: Request) {
        const { id, ...rest } = updatePictureDto
        const user = req.session.user
        const oldPicture = await this.getById(id)
        this.validPicture(oldPicture)
        await this.checkPictureAuth(user, oldPicture, SpaceUserPermissionConstant.PICTURE_EDIT)
        const result = await this.prismaService.picture.update({
            where: { id },
            data: {
                ...rest,
                tags: JSON.stringify(rest.tags),
                reviewStatus: 0,
                editTime: new Date()
            }
        })
        if (!result) {
            throw new BusinessException('图片更新失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    async uploadBatch(uploadBatchPictureDto: UploadBatchPictureDto, req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const { keywords, count, spaceId } = uploadBatchPictureDto
        if (spaceId) {
            const space = await this.spaceService.getById(spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            if (space.userId !== user.id) {
                throw new BusinessException('仅限本人空间使用', BusinessStatus.NOT_AUTH_ERROR.code)
            }
            if (space.totalCount >= space.maxCount) {
                throw new BusinessException('空间已满', BusinessStatus.OPERATION_ERROR.code)
            }
            if (space.totalSize >= space.maxSize) {
                throw new BusinessException('空间条数不足', BusinessStatus.OPERATION_ERROR.code)
            }
        }
        const imageUrl = await this.getPictureByKeywords(keywords, count)
        let uploadCount = 0
        const fileResult: UploadPictureVoModel[] = []
        for (const url of imageUrl) {
            try {
                const file = await this.ossService.uploadFile(url, null, spaceId ? 'space' : 'public')
                uploadCount++
                fileResult.push(file)
            } catch (error) {
                console.log('图片上传失败')
                continue
            }
        }
        return {
            count: uploadCount,
            list: fileResult,
            spaceId
        }
    }

    async setPicture(picture: UploadPictureVoModel[], spaceId: string, req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        await this.prismaService.picture.createMany({
            data: picture.map(item => ({
                url: item.url,
                name: item.filename,
                userId: user.id,
                introduction: '',
                category: '默认',
                tags: '["默认"]',
                picSize: BigInt(item.fileSize),
                picWidth: Number(item.width),
                picHeight: Number(item.height),
                picScale: item.picScale,
                picColor: item.color,
                picFormat: item.format,
                reviewStatus: 1,
                reviewTime: new Date(),
                reviewerId: user.id,
                thumbnailUrl: item.thumbnailUrl,
                spaceId
            }))
        })
    }

    async reviewPicture(reviewPictureDto: ReviewPictureDto, req: Request) {
        const user = req.session.user
        const { id, reviewStatus, reviewMessage } = reviewPictureDto
        const picture = await this.prismaService.picture.findUnique({
            where: { id }
        })
        this.validPicture(picture)
        if (picture.reviewStatus === reviewStatus) {
            throw new BusinessException('请勿重复审核', BusinessStatus.OPERATION_ERROR.code)
        }
        const result = await this.prismaService.picture.update({
            where: { id },
            data: {
                reviewStatus,
                reviewMessage,
                reviewTime: new Date(),
                reviewerId: user.id
            }
        })
        if (!result) {
            throw new BusinessException('图片审核失败', BusinessStatus.OPERATION_ERROR.code)
        }
        await this.messageService.pushMessage({
            userId: picture.userId,
            title: '鍥剧墖瀹℃牳缁撴灉',
            content: reviewMessage,
            messageType: MessageType.PICTURE_REVIEW,
            pictureId: id,
            bizId: id,
            result: reviewStatus,
            spaceId: picture.spaceId ?? undefined,
            actionUrl: picture.spaceId ? `/picture/${id}?spaceId=${picture.spaceId}` : `/picture/${id}`
        })
        /*
            const msg = await this.prismaService.message.create({
                data: {
                    userId: picture.userId,
                    content: reviewMessage,
                    hasRead: MessageStatus.UNREAD,
                    title: '图片审核结果',
                    pictureId: id
                }
            })
            this.sseService.emit({
                userId: picture.userId,
                data: {
                    id: msg.id,
                    content: reviewMessage,
                    title: '图片审核结果'
                }
            })
        */
        return true
    }

    validPicture(picture: Picture | GetPictureVoModel) {
        if (picture === null) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        if (picture.id === null) {
            throw new BusinessException('id不能为空', BusinessStatus.OPERATION_ERROR.code)
        }
        if (picture.url !== '') {
            if (picture.url.length > 1024) {
                throw new BusinessException('url过长', BusinessStatus.OPERATION_ERROR.code)
            }
        }
    }

    async findDeletedPicture() {
        return await this.prismaService.picture.findMany({
            where: {
                isDelete: 1
            }
        })
    }

    async deletePictureById(id: string) {
        const result = await this.prismaService.picture.delete({
            where: { id }
        })
        if (!result) {
            throw new BusinessException('图片删除失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    async hardDeleteDeletedPicturesByIds(ids: string[]) {
        const uniqueIds = Array.from(new Set(ids))
        if (uniqueIds.length === 0) {
            return 0
        }

        const deletedCount = await this.prismaService.$executeRaw(
            Prisma.sql`DELETE FROM picture WHERE isDelete = 1 AND id IN (${Prisma.join(uniqueIds)})`
        )

        await this.redisCacheService.clear()
        return Number(deletedCount)
    }

    async deletePictureByIds(deleteBatchPictureDto: DeleteBatchPictureDto, req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const oldPicture = await this.getByIds(deleteBatchPictureDto.ids)
        if (!oldPicture) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        for (const picture of oldPicture) {
            await this.checkPictureAuth(user, picture, SpaceUserPermissionConstant.PICTURE_DELETE)
        }
        const result = await this.prismaService.picture.deleteMany({
            where: {
                id: {
                    in: deleteBatchPictureDto.ids
                }
            }
        })
        if (result.count === 0) {
            throw new BusinessException('图片删除失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    async getPictureByKeywords(keywords: string, count: number) {
        const url = `https://image.baidu.com/search/acjson?tn=resultjson_com&word=${keywords}&pn=${count}`
        const response = await fetch(url)
        const res = await response.json()
        let imageUrl: string[] = []
        res.data.forEach((item: any) => {
            imageUrl.push(item.thumbURL)
        })
        if (imageUrl.length === 0) {
            throw new BusinessException('图片链接不能为空', BusinessStatus.OPERATION_ERROR.code)
        }
        if (imageUrl.length > count) {
            imageUrl = imageUrl.slice(0, count)
        }
        return imageUrl
    }

    /**
     * 校验权限
     */
    async checkPictureAuth(user: LoginVoModel, picture: GetPictureVoModel, needPermission: string) {
        const spaceId = picture.spaceId
        if (!spaceId) {
            // 公共图库
            if (picture.user.id !== user.id && user.userRole !== UserRole.ADMIN) {
                throw new BusinessException('仅限本人或管理员使用', BusinessStatus.NOT_AUTH_ERROR.code)
            }
            return
        }

        await this.ensureSpacePermission(spaceId, user, needPermission)
    }

    private async ensureSpacePermission(spaceId: string, user: LoginVoModel, needPermission: string) {
        const space = await this.spaceService.getById(spaceId)
        if (!space) {
            throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const permissionList = await this.spaceUserAuthManager.getPermissionList(space, user)
        if (!permissionList.includes(needPermission)) {
            throw new BusinessException('无权限', BusinessStatus.NOT_AUTH_ERROR.code)
        }
    }

    // 用户查询图片接口
    async queryPictureUser(queryPictureDto: PartialQueryPictureDto) {
        const { searchText } = queryPictureDto
        const where: Prisma.pictureWhereInput = {
            reviewStatus: ReviewStatus.PASS,
            spaceId: null
        }
        if (searchText) {
            where.OR = [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
        }
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where,
                orderBy: {
                    createTime: 'desc'
                }
            }),
            this.prismaService.picture.count({ where })
        ])
        const result: ShowPictureModelVo[] = data.map(item => ({
            id: item.id,
            url: item.url,
            introduction: item.introduction,
            category: item.category,
            tags: item.tags === '' ? [] : JSON.parse(item.tags) || [],
            format: item.picFormat,
            fileSize: item.picSize,
            width: item.picWidth,
            height: item.picHeight,
            filename: item.name,
            picScale: item.picScale,
            thumbnailUrl: item.thumbnailUrl,
            color: item.picColor,
            viewNumber: item.viewNumber,
            likeNumber: item.likeNumber,
            downloadNumber: item.downloadNumber,
            collectionNumber: item.collectionNumber
        }))
        return {
            list: result,
            total
        }
    }

    // 根据颜色值查询图片
    async getPictureByColor(spaceId: string, color: string, req: Request) {
        const user = req.session.user
        if (!spaceId || !color) {
            throw new BusinessException('参数错误', BusinessStatus.PARAMS_ERROR.code)
        }
        await this.ensureSpacePermission(spaceId, user, SpaceUserPermissionConstant.PICTURE_VIEW)
        const pictureList = await this.prismaService.picture.findMany({
            where: {
                spaceId,
                picColor: {
                    not: ''
                }
            }
        })
        if (!pictureList || pictureList.length === 0) {
            return []
        }
        // 遍历查询的结构，与颜色值进行相似度匹配，并进行排序(相似度高的在前面)
        const originColor = hexToRgb(color)
        return pictureList
            .map(item => {
                const itemColor = hexToRgb(item.picColor)
                const distance = euclideanDistance(originColor, itemColor)
                const similarity = normalizeDistance(distance)
                return {
                    item,
                    similarity
                }
            })
            .sort((a, b) => b.similarity - a.similarity)
            .map(item => ({ ...item.item, tags: item.item.tags === '' ? [] : JSON.parse(item.item.tags) || [] }))
            .slice(0, 12)
    }

    // 批量编辑图片
    async editPictureBatch(editPictureByBatchDto: EditPictureByBatchDto, req: Request) {
        const user = req.session.user
        const { idList, spaceId, category, tags, nameRule } = editPictureByBatchDto
        if (!user || !user.id) {
            throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        if (!spaceId || !idList || idList.length === 0) {
            throw new BusinessException('参数错误', BusinessStatus.PARAMS_ERROR.code)
        }
        await this.ensureSpacePermission(spaceId, user, SpaceUserPermissionConstant.PICTURE_EDIT)
        return await this.prismaService.$transaction(async prisma => {
            let count = 1
            // Update pictures one by one to increment count
            const result = await Promise.all(
                idList.map(async id => {
                    return await prisma.picture.update({
                        where: {
                            id,
                            spaceId
                        },
                        data: {
                            category: category ? category : undefined,
                            tags: tags.length > 0 ? JSON.stringify(tags) : undefined,
                            name: nameRule ? this.generateFileName(nameRule, count++) : undefined
                        }
                    })
                })
            )
            if (!result) {
                throw new BusinessException('图片批量编辑失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return true
        })
    }

    generateFileName(rule: string, index: number) {
        return rule.replace(/{index}/g, index.toString())
    }

    // 创建扩图任务
    async createAiExpandPictureTask(aiExpandPictureDto: AiExpandPictureDto, req: Request) {
        const user = req.session.user
        const { pictureId, aiExpandPictureCreateDto } = aiExpandPictureDto
        if (!pictureId || !aiExpandPictureCreateDto) {
            throw new BusinessException('参数错误', BusinessStatus.PARAMS_ERROR.code)
        }
        const picture = await this.getById(pictureId)
        if (!picture) {
            throw new BusinessException('图片不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        await this.checkPictureAuth(user, picture, SpaceUserPermissionConstant.PICTURE_EDIT)
        return await this.aiService.createOutPaintingTask(aiExpandPictureCreateDto)
    }

    // 获取扩图任务
    async getAiExpandPictureTask(taskId: string) {
        return await this.aiService.getOutPaintingTask(taskId)
    }

    // 获取生成图片任务
    async getGenerateImageTask(aiGeneratePictureDto: AiGeneratePictureDto) {
        return await this.aiService.getGenerateImageTask(aiGeneratePictureDto)
    }

    async genGenerateImage(taskId: string) {
        return await this.aiService.generateImage(taskId)
    }
}
