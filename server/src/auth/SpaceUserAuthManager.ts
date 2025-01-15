import { SpaceUserAuthConfig } from './SpaceUserAuthConfig'
import * as fs from 'node:fs'
import * as path from 'node:path'

export class SpaceUserAuthManager {
    static spaceAuthConfig: SpaceUserAuthConfig
    static {
        const json = fs.readFileSync(path.resolve(process.cwd(), 'spaceUserAuthConfig.json'), 'utf8')
        this.spaceAuthConfig = JSON.parse(json)
    }

    // 根据角色获取权限列表
    getPermissionsByRole(spaceUserRole: string) {
        if (!spaceUserRole) return []
        const role = SpaceUserAuthManager.spaceAuthConfig.roles.find(item => item.key === spaceUserRole)
        if (!role) return []
        return role.permissions
    }
}
