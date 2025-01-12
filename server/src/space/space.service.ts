import { UpdateSpaceDto } from './dto/update-space.dto'
import { Injectable } from '@nestjs/common'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { getSpaceLevelEnumByValue, getSpaceTypeEnumByValue, SpaceLevelEnum, SpaceTypeEnum } from './enum'
import { Space } from './entities/space.entity'
import { PrismaService } from '../prisma/prisma.service'
import { CreateSpaceDto } from './dto/create-space.dto'
import { type Request } from 'express'
import { UserRole } from '../user/enum/user'
import { DeleteSpaceDto } from './dto/delete-space.dto'
import { EditSpaceDto } from './dto/edit-space.dto'
import { QuerySpaceDto } from './dto/query-space.dto'
import { Prisma } from '@prisma/client'
import { PictureVoModel } from 'src/picture/vo/picture.vo'
import { SpaceModelVo } from './vo/space.vo'
import { LoginVoModel } from '../user/vo'

@Injectable()
export class SpaceService {
    constructor(private readonly prismaService: PrismaService) {}

    // 空间管理员使用
    async updateSpace(updateSpaceDto: UpdateSpaceDto) {
        if (updateSpaceDto === null || updateSpaceDto.id === null) {
            throw new BusinessException(BusinessStatus.PARAMS_ERROR.message, BusinessStatus.PARAMS_ERROR.code)
        }
        const space = new Space()
        space.id = updateSpaceDto.id
        space.spaceName = updateSpaceDto.spaceName
        space.spaceLevel = updateSpaceDto.spaceLevel
        space.maxSize = updateSpaceDto.maxSize
        space.maxCount = updateSpaceDto.maxCount
        // 数据校验
        this.validateSpace(space, false)
        // 自动填充数据
        this.fillSpaceBySpaceLevel(space)

        // 判断数据是否存在
        const oldSpace = await this.prismaService.space.findUnique({ where: { id: updateSpaceDto.id } })
        if (!oldSpace) {
            throw new BusinessException('该空间不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        // 更新数据
        const result = await this.prismaService.space.update({
            where: { id: updateSpaceDto.id },
            data: {
                spaceName: space.spaceName,
                spaceLevel: space.spaceLevel,
                maxSize: space.maxSize,
                maxCount: space.maxCount
            }
        })
        if (!result) {
            throw new BusinessException('更新空间失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    // 创建空间
    async addSpace(createSpaceDto: CreateSpaceDto, req: Request) {
        const user = req.session.user
        if (user === null || user === undefined) {
            throw new BusinessException('用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }
        const space = new Space()
        space.spaceName = createSpaceDto.spaceName
        space.spaceLevel = createSpaceDto.spaceLevel
        space.userId = user.id
        this.validateSpace(space, true)
        this.fillSpaceBySpaceLevel(space)
        // 权限校验
        if (SpaceLevelEnum.FREE !== space.spaceLevel && user.role !== UserRole.ADMIN) {
            throw new BusinessException('无权限创建指定级别的空间', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        // 针对用户进行加锁
        const lock = await this.prismaService.$transaction(async prisma => {
            // 查询用户是否已创建过空间
            const existSpace = await prisma.space.findFirst({
                where: {
                    userId: user.id as string
                }
            })
            if (existSpace) {
                throw new BusinessException('每个用户只能创建一个空间', BusinessStatus.PARAMS_ERROR.code)
            }
            // 创建空间
            const result = await prisma.space.create({
                data: {
                    spaceName: space.spaceName,
                    spaceLevel: space.spaceLevel,
                    maxSize: space.maxSize,
                    maxCount: space.maxCount,
                    userId: space.userId
                }
            })
            if (!result) {
                throw new BusinessException('创建空间失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return result.id
        })
        if (lock === null || lock === undefined) {
            throw new BusinessException('创建空间失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return lock
    }

    async getById(id: string) {
        const result = await this.prismaService.space.findUnique({
            where: {
                id
            }
        })
        if (!result) {
            throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        return result
    }

    async deleteSpace(deleteSpaceDto: DeleteSpaceDto, req: Request) {
        const { id } = deleteSpaceDto
        const user = req.session.user
        if (!id) {
            throw new BusinessException('空间ID不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        if (user.role !== UserRole.ADMIN && id !== user.id) {
            throw new BusinessException('无权限删除空间', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        const space = await this.getById(id)
        this.validateSpace(space, false)
        const result = await this.prismaService.$transaction(async prisma => {
            const deletedSpace = await prisma.space.delete({
                where: {
                    id
                }
            })
            // 删除空间下的所有图片
            await prisma.picture.deleteMany({
                where: {
                    spaceId: id
                }
            })
            return deletedSpace
        })
        if (!result) {
            throw new BusinessException('删除空间失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    async getSpaceByPage(query: QuerySpaceDto) {
        const { current, pageSize, spaceName, spaceLevel, userId, id, spaceType } = query
        const where: Prisma.spaceWhereInput = {}
        if (spaceName) {
            where.spaceName = {
                contains: spaceName
            }
        }
        if (spaceLevel) {
            where.spaceLevel = spaceLevel
        }
        if (userId) {
            where.userId = userId
        }
        if (spaceType) {
            where.spaceType = spaceType
        }
        if (id) {
            where.id = id
        }
        const [data, total] = await Promise.all([
            this.prismaService.space.findMany({
                where,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.space.count({
                where
            })
        ])
        const result: SpaceModelVo[] = await Promise.all(
            data.map(async item => {
                const user = await this.prismaService.user.findUnique({
                    where: { id: item.userId }
                })
                return {
                    id: item.id,
                    spaceName: item.spaceName,
                    spaceLevel: item.spaceLevel,
                    maxSize: item.maxSize,
                    maxCount: item.maxCount,
                    totalSize: item.totalSize,
                    totalCount: item.totalCount,
                    spaceType: item.spaceType,
                    userId: item.userId,
                    createTime: item.createTime,
                    editTime: item.editTime,
                    updateTime: item.updateTime,
                    user: {
                        id: user?.id,
                        userName: user?.userName,
                        userAvatar: user?.userAvatar,
                        userProfile: user?.userProfile,
                        userRole: user?.userRole,
                        createTime: user?.createTime.toISOString(),
                        userAccount: user?.userAccount
                    }
                }
            })
        )
        return {
            list: result,
            total
        }
    }

    // 空间创建人使用
    async editSpace(editSpaceDto: EditSpaceDto, req: Request) {
        const { id, spaceName } = editSpaceDto
        const user = req.session.user
        if (!id) {
            throw new BusinessException('空间ID不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        if (id !== user.id) {
            throw new BusinessException('无权限编辑空间', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        const space = await this.getById(id)
        this.validateSpace(space, false)
        const result = await this.prismaService.space.update({
            where: {
                id
            },
            data: {
                spaceName
            }
        })
        if (!result) {
            throw new BusinessException('编辑空间失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    // 创建团队空间
    // 创建空间
    async addTeamSpace(createSpaceDto: CreateSpaceDto, req: Request) {
        const user = req.session.user
        const space = new Space()
        space.spaceName = createSpaceDto.spaceName
        space.spaceLevel = createSpaceDto.spaceLevel
        space.userId = user.id
        if (user === null || user === undefined) {
            throw new BusinessException('用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }
        if (!createSpaceDto.spaceName) {
            space.spaceName = '默认空间'
        }
        if (!createSpaceDto.spaceLevel) {
            space.spaceLevel = SpaceLevelEnum.FREE
        }
        if (!createSpaceDto.spaceType) {
            space.spaceType = SpaceTypeEnum.TEAM
        }
        this.validateSpace(space, true)
        this.fillSpaceBySpaceLevel(space)
        // 权限校验
        if (SpaceLevelEnum.FREE !== space.spaceLevel && user.role !== UserRole.ADMIN) {
            throw new BusinessException('无权限创建指定级别的空间', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        // 针对用户进行加锁
        const lock = await this.prismaService.$transaction(async prisma => {
            // 查询用户是否已创建过空间
            const existSpace = await prisma.space.findFirst({
                where: {
                    userId: user.id as string,
                    spaceType: {
                        equals: SpaceTypeEnum.TEAM
                    }
                }
            })
            if (existSpace) {
                throw new BusinessException('每个用户只能创建一个空间', BusinessStatus.PARAMS_ERROR.code)
            }
            // 创建空间
            const result = await prisma.space.create({
                data: {
                    spaceName: space.spaceName,
                    spaceLevel: space.spaceLevel,
                    maxSize: space.maxSize,
                    maxCount: space.maxCount,
                    userId: space.userId,
                    spaceType: space.spaceType
                }
            })
            if (!result) {
                throw new BusinessException('创建空间失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return result.id
        })
        if (lock === null || lock === undefined) {
            throw new BusinessException('创建空间失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return lock
    }

    validateSpace(space: Space, add: boolean) {
        if (space === null) {
            throw new BusinessException(BusinessStatus.PARAMS_ERROR.message, BusinessStatus.PARAMS_ERROR.code)
        }
        const spaceName = space.spaceName
        const spaceLevel = space.spaceLevel
        const spaceLevelEnum = getSpaceLevelEnumByValue(space.spaceLevel)
        const spaceTypeEnum = getSpaceTypeEnumByValue(space.spaceType)
        // 创建空间
        if (add) {
            if (spaceName === null || spaceName === undefined) {
                throw new BusinessException('空间名称不能为空', BusinessStatus.PARAMS_ERROR.code)
            }
            if (spaceLevel === null) {
                throw new BusinessException('空间等级不能为空', BusinessStatus.PARAMS_ERROR.code)
            }
        }
        // 修改空间
        if (spaceLevel !== null && spaceLevelEnum === null) {
            throw new BusinessException('空间等级不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        if (spaceName !== null && spaceName !== undefined && spaceName.length > 30) {
            throw new BusinessException('空间名称不能超过30个字符', BusinessStatus.PARAMS_ERROR.code)
        }
        if (space.spaceType !== null && spaceTypeEnum === null) {
            throw new BusinessException('空间类型不存在', BusinessStatus.PARAMS_ERROR.code)
        }
    }

    fillSpaceBySpaceLevel(space: Space) {
        const spaceLevelEnum = getSpaceLevelEnumByValue(space.spaceLevel)
        if (spaceLevelEnum !== null) {
            const maxSize = spaceLevelEnum.maxSize
            const maxCount = spaceLevelEnum.maxCount
            if (space.maxSize === null || space.maxSize === undefined) {
                space.maxSize = maxSize
            }
            if (space.maxCount === null || space.maxCount === undefined) {
                space.maxCount = maxCount
            }
        }
    }

    checkSpaceAuth(space: Space, user: LoginVoModel) {
        if (space.userId !== user.id && user.userRole !== UserRole.ADMIN) {
            throw new BusinessException('无权访问空间', BusinessStatus.NOT_AUTH_ERROR.code)
        }
    }
}
