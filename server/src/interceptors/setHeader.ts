import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class SetHeadersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse()
        // 在响应头中设置自定义的值
        response.setHeader('Access-Control-Allow-Credentials', 'true')

        return next.handle()
    }
}
