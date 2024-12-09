import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { NotLoginException } from '../custom-exception'
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

@Catch(NotLoginException)
export class NotLoginExceptionFilter implements ExceptionFilter {
    catch(exception: NotLoginException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        response.status(401).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
            code: exception.getStatus()
        })
    }
}
