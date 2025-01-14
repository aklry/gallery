import { Injectable } from '@nestjs/common'
import { AddSpaceUserDto } from './dto'
import { SpaceUser } from './entities/space-user.entity'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { SpaceService } from '../space/space.service'
import { UserService } from '../user/user.service'
import { SpaceRoleHelper } from './enum/space-role'
import { PrismaService } from '../prisma/prisma.service'
import { type Request } from 'express'
import { SpaceUserModelVo } from './vo'
import { UserVoModel } from '../user/vo'
import { SpaceModelVo } from '../space/vo'

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

    async getSpaceUser(spaceUser: SpaceUser, req: Request) {
        const user = req.session.user
        const userId = user.id
        const spaceUserVo = {} as SpaceUserModelVo
        if (userId) {
            const loginUser = await this.userService.getUserById(userId)
            spaceUserVo.user = {
                id: loginUser.id,
                userAccount: loginUser.userAccount,
                userName: loginUser.userName,
                userAvatar: loginUser.userAvatar,
                userProfile: loginUser.userProfile,
                userRole: loginUser.userRole
            } as UserVoModel
        }
        const spaceId = spaceUser.spaceId
        if (spaceId) {
            const space = await this.spaceService.getById(spaceId)
            spaceUserVo.space = {
                id: space.id,
                spaceName: space.spaceName,
                spaceType: space.spaceType,
                maxCount: space.maxCount,
                maxSize: space.maxSize,
                totalCount: space.totalCount,
                totalSize: space.totalSize,
                userId: space.userId,
                user: spaceUserVo.user,
                createTime: space.createTime,
                editTime: space.editTime,
                updateTime: space.updateTime
            } as SpaceModelVo
        }
        return spaceUserVo
    }

    // 获取空间成员列表
    async getSpaceUserList(spaceUserList: Array<SpaceUser>) {
        if (spaceUserList.length === 0) {
            return []
        }
        // 对象列表 -> 对象vo列表
        const spaceUserVoList = spaceUserList.map(
            spaceUser =>
                ({
                    id: spaceUser.id,
                    userId: spaceUser.userId,
                    spaceId: spaceUser.spaceId,
                    spaceRole: spaceUser.spaceRole,
                    createTime: spaceUser.createTime,
                    updateTime: spaceUser.updateTime,
                    user: null,
                    space: null
                }) as SpaceUserModelVo
        )
        const userIdList = spaceUserList.map(spaceUser => spaceUser.userId)
        const spaceIdList = spaceUserList.map(spaceUser => spaceUser.spaceId)
        // 批量查询用户和空间
        const userList = await this.userService.getUserByIds(userIdList)
        const spaceList = await this.spaceService.getByIds(spaceIdList)
        const userListMap = userList.reduce((map, user) => {
            if (!map.has(user.id)) {
                map.set(user.id, [])
            }
            map.get(user.id).push(user)
            return map
        }, new Map<string, UserVoModel[]>())
        const spaceListMap = spaceList.reduce((map, space) => {
            if (!map.has(space.id)) {
                map.set(space.id, [])
            }
            map.get(space.id).push(space)
            return map
        }, new Map<string, SpaceModelVo[]>())
    }

    // 校验空间成员对象
    validateSpaceUser(spaceUser: SpaceUser, add: boolean = true) {
        if (!spaceUser) {
            throw new BusinessException('空间成员对象不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const { userId, spaceId, spaceRole } = spaceUser
        if (add) {
            // 添加空间成员
            if (!userId || !spaceId || !spaceRole) {
                throw new BusinessException('空间成员对象参数不能为空', BusinessStatus.PARAMS_ERROR.code)
            }
            this.userService.getUserById(userId).then(user => {
                if (!user) {
                    throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
                }
            })
            this.spaceService.getById(spaceId).then(space => {
                if (!space) {
                    throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
                }
            })
        }
        const spaceRoleEnum = SpaceRoleHelper.getEnumByValue(spaceRole)
        if (spaceRole !== null && !spaceRoleEnum) {
            throw new BusinessException('空间角色不存在', BusinessStatus.PARAMS_ERROR.code)
        }
    }
}
