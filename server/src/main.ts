import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SetResponseDataInterceptor } from './interceptors'
import { VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { HttpExceptionFilter, BusinessExceptionFilter } from './filters'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.enableVersioning({
        type: VersioningType.URI
    })
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true
    })
    // 注册全局响应拦截器
    app.useGlobalInterceptors(new SetResponseDataInterceptor())
    // 注册全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter(), new BusinessExceptionFilter())
    // 注册swagger
    const config = new DocumentBuilder().setTitle('接口文档').setVersion('1.0').setDescription('源空间').build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
    // 提供 Swagger JSON 数据
    app.getHttpAdapter().get('/swagger-json', (req, res) => {
        res.send(document)
    })
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
