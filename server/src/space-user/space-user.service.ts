import { Injectable } from '@nestjs/common'
import { AddSpaceUserDto } from './dto'
import { SpaceUser } from './entities/space-user.entity'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { SpaceService } from '../space/space.service'
import { UserService } from '../user/user.service'
import { SpaceRoleHelper } from './enum/space-role'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SpaceUserService {
    constructor(
        private readonly spaceService: SpaceService,
        private readonly userService: UserService,
        private readonly prisma: PrismaService
    ) {}
    // 添加空间成员
    async addSpaceUser(addSpaceUserDto: AddSpaceUserDto) {
        const spaceUser = new SpaceUser()
        spaceUser.userId = addSpaceUserDto.userId
        spaceUser.spaceId = addSpaceUserDto.spaceId
        spaceUser.spaceRole = addSpaceUserDto.spaceRole
        this.validateSpaceUser(spaceUser, true)
        const result = await this.prisma.space_user.create({
            data: spaceUser
        })
        if (!result) {
            throw new BusinessException('添加空间成员失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return result.id
    }

    // 校验空间成员对象
    async validateSpaceUser(spaceUser: SpaceUser, add: boolean = true) {
        if (!spaceUser) {
            throw new BusinessException('空间成员对象不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const { userId, spaceId, spaceRole } = spaceUser
        if (add) {
            // 添加空间成员
            if (!userId || !spaceId || !spaceRole) {
                throw new BusinessException('空间成员对象参数不能为空', BusinessStatus.PARAMS_ERROR.code)
            }
            const user = await this.userService.getUserById(userId)
            if (!user) {
                throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            const space = await this.spaceService.getById(spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
        }
        const spaceRoleEnum = SpaceRoleHelper.getEnumByValue(spaceRole)
        if (spaceRole !== null && !spaceRoleEnum) {
            throw new BusinessException('空间角色不存在', BusinessStatus.PARAMS_ERROR.code)
        }
    }
}
