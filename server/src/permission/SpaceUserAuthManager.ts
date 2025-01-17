import { SpaceUserAuthConfig } from './SpaceUserAuthConfig'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SpaceUserAuthManager {
    static spaceAuthConfig: SpaceUserAuthConfig
    static {
        const json = fs.readFileSync(path.resolve(process.cwd(), 'src/permission/spaceUserAuthConfig.json'), 'utf8')
        SpaceUserAuthManager.spaceAuthConfig = JSON.parse(json)
    }

    // 根据角色获取权限列表
    getPermissionsByRole(spaceUserRole: string) {
        if (!spaceUserRole) return []
        const role = SpaceUserAuthManager.spaceAuthConfig.roles.find(item => item.key === spaceUserRole)
        if (!role) return []
        return role.permissions
    }
}
