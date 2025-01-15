import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from './permission.decorator'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly spaceUserAuthManager: SpaceUserAuthManager
    ) {}

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
        const userRole = user.userRole

        const userPermissions = this.spaceUserAuthManager.getPermissionsByRole(userRole)

        return requiredPermissions.every(permission => userPermissions.includes(permission))
    }
}
