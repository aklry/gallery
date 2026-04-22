import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SetResponseDataInterceptor } from '@shared/interceptors'
import { VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { HttpExceptionFilter, BusinessExceptionFilter, AllExceptionsFilter } from '@shared/filters'
import { ApiValidateMiddleware } from '@shared/middlewares/api-validate.middleware'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0)
    if (trustProxyHops > 0) {
        app.getHttpAdapter().getInstance().set('trust proxy', trustProxyHops)
    }
    app.setGlobalPrefix('api')
    app.enableVersioning({
        type: VersioningType.URI
    })
    app.enableCors({
        origin: process.env.CORS,
        credentials: true
    })
    // 注册全局响应拦截器
    app.useGlobalInterceptors(new SetResponseDataInterceptor())
    // 注册全局异常过滤器
    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter(), new BusinessExceptionFilter())
    // 注册全局中间件
    if (process.env.ENV === 'production') {
        const apiValidateMiddleware = new ApiValidateMiddleware()
        app.use(apiValidateMiddleware.use)
    }
    // 注册swagger
    if (process.env.ENV === 'development') {
        const config = new DocumentBuilder().setTitle('映刻图库').setVersion('1.0').setDescription('映刻图库').build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('docs', app, document)
        // 提供 Swagger JSON 数据
        app.getHttpAdapter().get('/swagger-json', (_req, res) => {
            res.send(document)
        })
    }
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
