import { Injectable } from '@nestjs/common'
import { AddSpaceUserDto, DeleteSpaceUserDto, EditSpaceUserDto, QuerySpaceUserDto } from './dto'
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
import { Prisma } from '@prisma/client'

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

    // 删除空间成员
    async deleteSpaceUser(deleteSpaceUserDto: DeleteSpaceUserDto) {
        const { id } = deleteSpaceUserDto
        if (!id) {
            throw new BusinessException('空间成员id不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const result = await this.prisma.space_user.delete({
            where: {
                id
            }
        })
        if (!result) {
            throw new BusinessException('删除空间成员失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return true
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
    async getSpaceUserVoList(spaceUserList: Array<SpaceUser>) {
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
        spaceUserVoList.forEach(spaceUserVo => {
            const userId = spaceUserVo.userId
            const spaceId = spaceUserVo.spaceId
            if (userListMap.has(userId)) {
                spaceUserVo.user = userListMap.get(userId)[0]
            }
            if (spaceListMap.has(spaceId)) {
                spaceUserVo.space = spaceListMap.get(spaceId)[0]
            }
        })
        return spaceUserVoList
    }

    // 查询某个成员在某个空间的信息
    async getOneSpaceUser(querySpaceUserDto: QuerySpaceUserDto) {
        const { userId, spaceId } = querySpaceUserDto
        if (!spaceId || !userId) {
            throw new BusinessException('空间成员对象参数不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const result = await this.prisma.space_user.findFirst({
            where: SpaceUserService.buildQuery(querySpaceUserDto)
        })
        if (!result) {
            throw new BusinessException('空间成员不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        return result as SpaceUser
    }

    async getSpaceUserList(querySpaceUserDto: QuerySpaceUserDto, req: Request) {
        const result = await this.prisma.space_user.findMany({
            where: SpaceUserService.buildQuery(querySpaceUserDto)
        })
        return this.getSpaceUserVoList(result)
    }
    // 修改空间成员信息(设置权限)
    async editSpaceUser(editSpaceUserDto: EditSpaceUserDto, req: Request) {
        const spaceUser = new SpaceUser()
        Object.assign(spaceUser, editSpaceUserDto)
        this.validateSpaceUser(spaceUser)
        const { id } = editSpaceUserDto
        const oldSpaceUser = await this.getById(id)
        if (!oldSpaceUser) {
            throw new BusinessException('空间成员不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const result = await this.prisma.space_user.update({
            where: {
                id
            },
            data: spaceUser
        })
        if (!result) {
            throw new BusinessException('设置权限失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return true
    }
    // 获取我加入的空间
    async getMyAddTeam(req: Request) {
        const user = req.session.user
        const querySpaceUserDto = new QuerySpaceUserDto()
        querySpaceUserDto.userId = user.id
        const result = await this.prisma.space_user.findMany({
            where: SpaceUserService.buildQuery(querySpaceUserDto)
        })
        return this.getSpaceUserVoList(result)
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

    // 构造查询条件
    static buildQuery(querySpaceUser: QuerySpaceUserDto) {
        const { userId, spaceId, spaceRole, id } = querySpaceUser
        const where: Prisma.space_userWhereInput = {}

        if (userId) {
            where.userId = userId
        }
        if (spaceId) {
            where.spaceId = spaceId
        }
        if (spaceRole) {
            where.spaceRole = spaceRole
        }
        if (id) {
            where.id = id
        }
        return where
    }

    async getById(id: string) {
        return await this.prisma.space_user.findFirst({
            where: {
                id
            }
        })
    }
}
