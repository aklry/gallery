import { UpdateSpaceDto } from './dto/update-space.dto'
import { Injectable } from '@nestjs/common'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { getEnumByValue, SpaceLevelEnum } from './enum'
import { Space } from './entities/space.entity'
import { PrismaService } from '../prisma/prisma.service'
import { CreateSpaceDto } from './dto/create-space.dto'
import { type Request } from 'express'
import { UserRole } from '../user/enum/user'
@Injectable()
export class SpaceService {
    constructor(private readonly prismaService: PrismaService) {}
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
    validateSpace(space: Space, add: boolean) {
        if (space === null) {
            throw new BusinessException(BusinessStatus.PARAMS_ERROR.message, BusinessStatus.PARAMS_ERROR.code)
        }
        const spaceName = space.spaceName
        const spaceLevel = space.spaceLevel
        const spaceLevelEnum = getEnumByValue(space.spaceLevel)
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
    }
    fillSpaceBySpaceLevel(space: Space) {
        const spaceLevelEnum = getEnumByValue(space.spaceLevel)
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
}
