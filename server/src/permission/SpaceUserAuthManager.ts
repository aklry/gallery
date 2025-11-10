import { SpaceUserAuthConfig } from './SpaceUserAuthConfig'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Injectable } from '@nestjs/common'
import { Space } from '../space/entities/space.entity'
import { LoginVoModel } from '../user/vo'
import { SpaceRoleMap } from '../space-user/enum/space-role'
import { UserRole } from '../user/enum/user'
import { getSpaceTypeEnumByValue, SpaceTypeEnum } from '../space/enum'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SpaceUserAuthManager {
    constructor(private readonly prisma: PrismaService) {}

    static spaceAuthConfig: SpaceUserAuthConfig
    static {
        const json = fs.readFileSync(path.resolve(__dirname, 'spaceUserAuthConfig.json'), 'utf8')
        SpaceUserAuthManager.spaceAuthConfig = JSON.parse(json)
    }

    // 根据角色获取权限列表
    getPermissionsByRole(spaceUserRole: string) {
        if (!spaceUserRole) return []
        const role = SpaceUserAuthManager.spaceAuthConfig.roles.find(item => item.key === spaceUserRole)
        if (!role) return []
        return role.permissions
    }

    async getPermissionList(space: Space, user: LoginVoModel) {
        if (!user) return []
        // 管理员权限
        const ADMIN_PERMISSIONS = this.getPermissionsByRole(SpaceRoleMap.admin.value)
        // 公共图库
        if (space === null) {
            if (user.userRole === UserRole.ADMIN) {
                return ADMIN_PERMISSIONS
            }
            return []
        }
        const { value } = getSpaceTypeEnumByValue(space.spaceType)
        if (value === null) {
            return []
        }
        switch (value) {
            case SpaceTypeEnum.PRIVATE:
                // 私有空间,仅本人或者管理员拥有所有权限
                if (space.userId === user.id || user.userRole === UserRole.ADMIN) {
                    return ADMIN_PERMISSIONS
                }
                return []
            case SpaceTypeEnum.TEAM:
                // 团队空间，查询SpaceUser并获取角色和权限
                const spaceUser = await this.prisma.space_user.findFirst({
                    where: {
                        spaceId: space.id,
                        userId: user.id
                    }
                })
                if (spaceUser === null) {
                    return []
                }
                return this.getPermissionsByRole(spaceUser.spaceRole)
        }
    }
}
