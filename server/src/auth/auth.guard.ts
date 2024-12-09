import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { BusinessStatus } from 'src/config'
import { NotLoginException } from 'src/custom-exception'

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const session = context.switchToHttp().getRequest().session
        if (!session.user || !session.user.id) {
            throw new NotLoginException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        return true
    }
}
