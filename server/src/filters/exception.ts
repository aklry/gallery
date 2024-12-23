import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { BusinessException } from '../custom-exception'
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()
        response.status(exception.getStatus()).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
            code: exception.getStatus()
        })
    }
}

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        response.status(200).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
            code: exception.getStatus()
        })
    }
}
