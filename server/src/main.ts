import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SetHeadersInterceptor, SetResponseDataInterceptor } from './interceptors'
import { VersioningType } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix(`api/${process.env.API_VERSION}`)
    app.enableVersioning({
        type: VersioningType.URI
    })
    app.enableCors({
        origin: 'http://localhost:5173'
    })
    // 注册全局响应拦截器
    app.useGlobalInterceptors(new SetHeadersInterceptor(), new SetResponseDataInterceptor())
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
