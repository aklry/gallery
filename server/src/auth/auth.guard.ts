import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { BusinessStatus } from '../config'
import { BusinessException } from '../custom-exception'
import { Roles } from '../role/role.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const session = context.switchToHttp().getRequest().session
        if (!session.user || !session.user.id) {
            throw new BusinessException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        return true
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>(Roles, context.getHandler())
        if (!roles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.session.user
        if (!user || !user.id) {
            throw new BusinessException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const hasAuth = roles.includes(user.userRole)
        if (!hasAuth) {
            throw new BusinessException(BusinessStatus.NOT_AUTH_ERROR.message, BusinessStatus.NOT_AUTH_ERROR.code)
        }
        return hasAuth
    }
}
