import { Injectable } from '@nestjs/common'
import { Prisma, SpaceRole } from '@prisma/client'
import type { Request } from 'express'
import { BusinessStatus } from '@core/config'
import { PrismaService } from '@core/prisma/prisma.service'
import { UserService } from '@identity/user/user.service'
import { UserVoModel } from '@identity/user/vo'
import { SpaceTypeEnum, getSpaceTypeEnumByValue } from '@space/core/enum'
import { SpaceService } from '@space/core/space.service'
import { SpaceModelVo } from '@space/core/vo'
import { BusinessException } from '@shared/custom-exception'
import { AddSpaceUserDto, DeleteSpaceUserDto, EditSpaceUserDto, QuerySpaceUserDto, QuitSpaceUserDto } from './dto'
import { SpaceRoleHelper } from './enum/space-role'
import { SpaceUser } from './entities/space-user.entity'
import { SpaceUserModelVo } from './vo'

@Injectable()
export class SpaceUserService {
    constructor(
        private readonly spaceService: SpaceService,
        private readonly userService: UserService,
        private readonly prisma: PrismaService
    ) {}

    async addSpaceUser(addSpaceUserDto: AddSpaceUserDto) {
        const { userId, spaceId, spaceRole } = addSpaceUserDto
        this.validateSpaceRole(spaceRole)
        await this.getTeamSpaceOrThrow(spaceId)
        await this.ensureUserExists(userId)
        await this.ensureMembershipNotExists(spaceId, userId)

        const result = await this.prisma.space_user.create({
            data: {
                userId,
                spaceId,
                spaceRole
            }
        })
        if (!result) {
            throw new BusinessException('添加空间成员失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return result.id
    }

    async deleteSpaceUser(deleteSpaceUserDto: DeleteSpaceUserDto) {
        const targetSpaceUser = await this.getByIdOrThrow(deleteSpaceUserDto.id)
        const space = await this.getTeamSpaceOrThrow(targetSpaceUser.spaceId)
        this.ensureSpaceOwnerProtected(space.userId, targetSpaceUser.userId, '移除')
        await this.ensureAdminCountSafeForRemoval(targetSpaceUser)

        const result = await this.prisma.space_user.delete({
            where: {
                id: deleteSpaceUserDto.id
            }
        })
        if (!result) {
            throw new BusinessException('删除空间成员失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return true
    }

    async getSpaceUserVoList(spaceUserList: Array<SpaceUser>) {
        if (spaceUserList.length === 0) {
            return []
        }

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

        const userIdList = Array.from(new Set(spaceUserList.map(spaceUser => spaceUser.userId)))
        const spaceIdList = Array.from(new Set(spaceUserList.map(spaceUser => spaceUser.spaceId)))
        const [userList, spaceList] = await Promise.all([
            this.userService.getUserByIds(userIdList),
            this.spaceService.getByIds(spaceIdList)
        ])

        const userMap = new Map<string, UserVoModel>(userList.map(user => [user.id, user]))
        const spaceMap = new Map<string, SpaceModelVo>(spaceList.map(space => [space.id, space]))

        spaceUserVoList.forEach(spaceUserVo => {
            if (userMap.has(spaceUserVo.userId)) {
                spaceUserVo.user = userMap.get(spaceUserVo.userId) ?? null
            }
            if (spaceMap.has(spaceUserVo.spaceId)) {
                spaceUserVo.space = spaceMap.get(spaceUserVo.spaceId) ?? null
            }
        })

        return spaceUserVoList
    }

    async getOneSpaceUser(querySpaceUserDto: QuerySpaceUserDto) {
        const { id, userId, spaceId } = querySpaceUserDto
        if (!id && (!spaceId || !userId)) {
            throw new BusinessException('空间成员查询参数不能为空', BusinessStatus.PARAMS_ERROR.code)
        }

        const result = await this.prisma.space_user.findFirst({
            where: SpaceUserService.buildQuery(querySpaceUserDto)
        })
        if (!result) {
            throw new BusinessException('空间成员不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        return result as SpaceUser
    }

    async getSpaceUserList(querySpaceUserDto: QuerySpaceUserDto) {
        const { spaceId } = querySpaceUserDto
        if (!spaceId) {
            throw new BusinessException('spaceId 不能为空', BusinessStatus.PARAMS_ERROR.code)
        }

        await this.getTeamSpaceOrThrow(spaceId)
        const result = await this.prisma.space_user.findMany({
            where: SpaceUserService.buildQuery(querySpaceUserDto),
            orderBy: {
                createTime: 'asc'
            }
        })
        return this.getSpaceUserVoList(result)
    }

    async editSpaceUser(editSpaceUserDto: EditSpaceUserDto) {
        const { id, spaceRole } = editSpaceUserDto
        this.validateSpaceRole(spaceRole)

        const oldSpaceUser = await this.getByIdOrThrow(id)
        const space = await this.getTeamSpaceOrThrow(oldSpaceUser.spaceId)
        if (oldSpaceUser.spaceRole === spaceRole) {
            return true
        }

        this.ensureSpaceOwnerProtected(space.userId, oldSpaceUser.userId, '调整角色')
        if (oldSpaceUser.spaceRole === SpaceRole.admin && spaceRole !== SpaceRole.admin) {
            await this.ensureAdminCountSafeForRemoval(oldSpaceUser)
        }

        const result = await this.prisma.space_user.update({
            where: {
                id
            },
            data: {
                spaceRole
            }
        })
        if (!result) {
            throw new BusinessException('设置成员角色失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return true
    }

    async quitSpace(quitSpaceUserDto: QuitSpaceUserDto, req: Request) {
        const user = req.session.user
        const { spaceId } = quitSpaceUserDto
        const space = await this.getTeamSpaceOrThrow(spaceId)
        if (space.userId === user.id) {
            throw new BusinessException('空间创建者不能退出团队空间', BusinessStatus.PARAMS_ERROR.code)
        }

        const targetSpaceUser = await this.prisma.space_user.findFirst({
            where: {
                spaceId,
                userId: user.id
            }
        })
        if (!targetSpaceUser) {
            throw new BusinessException('你不是该空间成员', BusinessStatus.PARAMS_ERROR.code)
        }

        await this.ensureAdminCountSafeForRemoval(targetSpaceUser)
        const result = await this.prisma.space_user.delete({
            where: {
                id: targetSpaceUser.id
            }
        })
        if (!result) {
            throw new BusinessException('退出团队空间失败', BusinessStatus.SYSTEM_ERROR.code)
        }
        return true
    }

    async getMyAddTeam(req: Request) {
        const user = req.session.user
        const result = await this.prisma.space_user.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createTime: 'desc'
            }
        })
        const spaceUserVoList = await this.getSpaceUserVoList(result)
        return spaceUserVoList.filter(item => item.space?.spaceType === SpaceTypeEnum.TEAM)
    }

    validateSpaceRole(spaceRole: SpaceRole) {
        const spaceRoleEnum = SpaceRoleHelper.getEnumByValue(spaceRole)
        if (spaceRole !== null && !spaceRoleEnum) {
            throw new BusinessException('空间角色不存在', BusinessStatus.PARAMS_ERROR.code)
        }
    }

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

    private async getByIdOrThrow(id: string) {
        if (!id) {
            throw new BusinessException('空间成员 id 不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const spaceUser = await this.getById(id)
        if (!spaceUser) {
            throw new BusinessException('空间成员不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        return spaceUser
    }

    private async getTeamSpaceOrThrow(spaceId: string) {
        if (!spaceId) {
            throw new BusinessException('spaceId 不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const space = await this.spaceService.getById(spaceId)
        const spaceType = getSpaceTypeEnumByValue(space.spaceType)
        if (spaceType?.value !== SpaceTypeEnum.TEAM) {
            throw new BusinessException('仅团队空间支持成员管理', BusinessStatus.PARAMS_ERROR.code)
        }
        return space
    }

    private async ensureUserExists(userId: string) {
        if (!userId) {
            throw new BusinessException('用户 id 不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.userService.getUserById(userId)
        if (!user) {
            throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
        }
    }

    private async ensureMembershipNotExists(spaceId: string, userId: string) {
        const existed = await this.prisma.space_user.findFirst({
            where: {
                spaceId,
                userId
            }
        })
        if (existed) {
            throw new BusinessException('该用户已经是空间成员', BusinessStatus.PARAMS_ERROR.code)
        }
    }

    private ensureSpaceOwnerProtected(spaceOwnerUserId: string, targetUserId: string, action: string) {
        if (spaceOwnerUserId === targetUserId) {
            throw new BusinessException(`空间创建者不能被${action}`, BusinessStatus.PARAMS_ERROR.code)
        }
    }

    private async ensureAdminCountSafeForRemoval(spaceUser: SpaceUser) {
        if (spaceUser.spaceRole !== SpaceRole.admin) {
            return
        }
        const adminCount = await this.prisma.space_user.count({
            where: {
                spaceId: spaceUser.spaceId,
                spaceRole: SpaceRole.admin
            }
        })
        if (adminCount <= 1) {
            throw new BusinessException('至少保留一个空间管理员', BusinessStatus.PARAMS_ERROR.code)
        }
    }
}
