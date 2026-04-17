import { CallHandler, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'
import { RAW_RESPONSE_KEY } from '@core/config'

export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true)

// 将bigint转换为字符串，并保留日期类型不变
const transformBigInt = (obj: any) => {
    if (typeof obj === 'bigint') {
        return obj.toString()
    }
    if (Array.isArray(obj)) {
        return obj.map(transformBigInt)
    }
    if (obj !== null && typeof obj === 'object') {
        if (obj instanceof Date) {
            return obj
        }
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, transformBigInt(value)]))
    }
    return obj
}
@Injectable()
export class SetResponseDataInterceptor {
    private reflector = new Reflector()
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const isRaw = this.reflector.get<boolean>(RAW_RESPONSE_KEY, context.getHandler())
        if (isRaw) {
            return next.handle()
        }
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()
        return next.handle().pipe(
            map(data => {
                return {
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: data.message || '请求成功',
                    code: data.code || 200,
                    data: transformBigInt(data.data) || null
                }
            })
        )
    }
}
