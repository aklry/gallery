import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from './permission.decorator'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PermissionKit {
    private static spaceUserAuthManager: SpaceUserAuthManager

    static {
        PermissionKit.spaceUserAuthManager = new SpaceUserAuthManager(new PrismaService())
    }

    static hasPermission(userRole: string, permission: string): boolean {
        if (!PermissionKit.spaceUserAuthManager) {
            throw new Error('PermissionKit not initialized')
        }
        const userPermissions = PermissionKit.spaceUserAuthManager.getPermissionsByRole(userRole)
        return userPermissions.includes(permission)
    }

    static hasPermissions(userRole: string, permissions: string[]): boolean {
        return permissions.every(permission => PermissionKit.hasPermission(userRole, permission))
    }
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredPermissions) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.session.user
        if (!user) {
            throw new BusinessException('未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        return PermissionKit.hasPermissions(user.userRole, requiredPermissions)
    }
}
