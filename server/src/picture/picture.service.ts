import { Injectable } from '@nestjs/common'
import { extname } from 'node:path'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import type { Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { OssService } from '../oss/oss.service'
import { LoginVoModel } from '../user/vo'
import { UserRole } from '../user/enum/user'
import { Picture } from './entities/picture.entity'
import { ReviewStatus } from './enum'
import { MessageStatus, Prisma } from '@prisma/client'
import { ShowPictureModelVo, PictureVoModel, GetPictureVoModel, UploadPictureVoModel } from './vo'
import { RedisCacheService } from '../cache/cache.service'
import { SpaceService } from '../space/space.service'
import axios from 'axios'
import { hexToRgb, euclideanDistance, normalizeDistance } from '../utils'
import {
    EditPictureByBatchDto,
    PartialQueryPictureDto,
    QueryPictureDto,
    UploadBatchPictureDto,
    UpdatePictureDto,
    UploadPictureDto,
    DeletePictureDto,
    ReviewPictureDto,
    UploadPictureUrlDto,
    AiExpandPictureDto
} from './dto'
import { AiExpandPictureService } from '../ai-expand-picture/ai-expand-picture.service'

@Injectable()
export class PictureService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ossService: OssService,
        private readonly redisCacheService: RedisCacheService,
        private readonly spaceService: SpaceService,
        private readonly aiExpandPictureService: AiExpandPictureService
    ) {}

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
        const { current, pageSize, searchText, startEditTime, endEditTime, ...filters } = queryPictureDto
        if (Number(pageSize) > 20) {
            throw new BusinessException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }
        if (!filters.spaceId) {
            filters.reviewStatus = 1
            filters.nullSpaceId = true
        } else {
            const user = req.session.user
            const space = await this.spaceService.getById(filters.spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            if (space.userId !== user.id) {
                throw new BusinessException('无权限', BusinessStatus.NOT_AUTH_ERROR.code)
            }
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
            color: item.picColor
        }))
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

    async getById(id: string) {
        const result = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!result) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        return {
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
            createTime: result.createTime.toISOString(),
            userId: result.userId,
            editTime: result.editTime.toISOString(),
            user: {
                id: user?.id,
                userAccount: user?.userAccount,
                userName: user?.userName,
                userAvatar: user?.userAvatar,
                userProfile: user?.userProfile,
                userRole: user?.userRole
            } as LoginVoModel
        } as GetPictureVoModel
    }

    async getByIdVo(id: string) {
        const result = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!result) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        return {
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
            picColor: result.picColor,
            picFormat: result.picFormat,
            createTime: result.createTime.toISOString(),
            userId: result.userId,
            editTime: result.editTime.toISOString(),
            thumbnailUrl: result.thumbnailUrl,
            user: {
                id: user?.id,
                userAccount: user?.userAccount,
                userName: user?.userName,
                userAvatar: user?.userAvatar,
                userProfile: user?.userProfile,
                userRole: user?.userRole
            } as LoginVoModel
        } as GetPictureVoModel
    }

    async delete(deletePicture: DeletePictureDto, req: Request) {
        const { id } = deletePicture
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const userId = user.id
        const oldPicture = await this.getById(id)
        if (!oldPicture) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        this.checkPictureAuth(user, oldPicture)
        if (oldPicture.user.id !== userId && user.userRole !== UserRole.ADMIN) {
            throw new BusinessException('仅自己或管理员可以删除', BusinessStatus.OPERATION_ERROR.code)
        }
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
        let pictureId: string | undefined = undefined
        if (uploadPictureDto && uploadPictureDto.id) {
            pictureId = uploadPictureDto.id
            // 判断图片是否存在
            const picture = await this.prismaService.picture.findUnique({
                where: {
                    id: pictureId
                }
            })
            if (!picture) {
                throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
            }
            if (!spaceId) {
                if (picture.spaceId) {
                    spaceId = picture.spaceId
                }
            } else {
                if (picture.spaceId !== spaceId) {
                    throw new BusinessException('图片空间不匹配', BusinessStatus.OPERATION_ERROR.code)
                }
            }
            if (picture.userId !== user.id && user.userRole !== UserRole.ADMIN) {
                throw new BusinessException('仅限本人或管理员修改', BusinessStatus.OPERATION_ERROR.code)
            }
        }
        // 上传图片
        const name = typeof file === 'string' ? file : file.originalname
        const buffer = typeof file === 'string' ? null : file.buffer
        const ossResult = await this.ossService.uploadFile(name, buffer, spaceId ? 'space' : 'public')
        const reviewStatus = user.userRole === UserRole.ADMIN ? 1 : 0
        const reviewTime = user.userRole === UserRole.ADMIN ? new Date() : undefined
        const picture = pictureId
            ? await this.prismaService.picture.update({
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
                  }
              })
            : await this.prismaService.picture.create({
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
                      tags: '',
                      category: '',
                      introduction: '',
                      thumbnailUrl: ossResult.thumbnailUrl
                  }
              })
        if (!picture) {
            throw new BusinessException('图片上传失败', BusinessStatus.OPERATION_ERROR.code)
        }
        if (spaceId) {
            await this.prismaService.$transaction(async prisma => {
                const space = await prisma.space.update({
                    where: {
                        id: spaceId
                    },
                    data: {
                        totalCount: {
                            increment: 1
                        },
                        totalSize: {
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
        console.log(rest)
        const user = req.session.user
        const oldPicture = await this.getById(id)
        this.validPicture(oldPicture)
        this.checkPictureAuth(user, oldPicture)
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
                category: '',
                tags: '',
                picSize: BigInt(item.fileSize),
                picWidth: Number(item.width),
                picHeight: Number(item.height),
                picScale: item.picScale,
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
        } else {
            await this.prismaService.message.create({
                data: {
                    userId: picture.userId,
                    content: reviewMessage,
                    hasRead: MessageStatus.UNREAD,
                    title: '图片审核结果'
                }
            })
        }
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

    async getPictureByKeywords(keywords: string, count: number) {
        const url = `https://images.baidu.com/search/acjson?tn=resultjson_com&word=${keywords}&pn=${count}`
        const res = await axios.get(url)
        let imageUrl: string[] = []
        res.data.data.forEach((item: any) => {
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
    checkPictureAuth(user: LoginVoModel, picture: GetPictureVoModel) {
        const spaceId = picture.spaceId
        if (!spaceId) {
            // 公共图库
            if (picture.user.id !== user.id && user.userRole !== UserRole.ADMIN) {
                throw new BusinessException('仅限本人或管理员使用', BusinessStatus.NOT_AUTH_ERROR.code)
            }
        } else {
            // 空间图片
            if (picture.user.id !== user.id) {
                throw new BusinessException('无权限', BusinessStatus.NOT_AUTH_ERROR.code)
            }
        }
    }

    // 用户查询图片接口
    async queryPictureUser(queryPictureDto: PartialQueryPictureDto) {
        const { searchText } = queryPictureDto
        const where: Prisma.pictureWhereInput = {}
        if (searchText) {
            where.OR = [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
        }
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where
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
            color: item.picColor
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
        const space = await this.spaceService.getById(spaceId)
        if (!space) {
            throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        if (user.id !== space.userId) {
            throw new BusinessException('没有空间访问权限', BusinessStatus.NOT_AUTH_ERROR.code)
        }
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
        const space = await this.spaceService.getById(spaceId)
        if (!user || !user.id) {
            throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        if (!spaceId || !idList || idList.length === 0) {
            throw new BusinessException('参数错误', BusinessStatus.PARAMS_ERROR.code)
        }
        if (!space) {
            throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        if (user.id !== space.userId) {
            throw new BusinessException('没有空间访问权限', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        return await this.prismaService.$transaction(async prisma => {
            let count = 1
            // Update pictures one by one to increment count
            const result = await Promise.all(
                idList.map(async id => {
                    const updated = await prisma.picture.update({
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
                    return updated
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
        this.checkPictureAuth(user, picture)
        return await this.aiExpandPictureService.createOutPaintingTask(aiExpandPictureCreateDto)
    }

    // 获取扩图任务
    async getAiExpandPictureTask(taskId: string) {
        return await this.aiExpandPictureService.getOutPaintingTask(taskId)
    }
}
