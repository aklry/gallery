import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResponseModule } from './response/response.module'
import { PrismaModule } from './prisma/prisma.module'
import * as session from 'express-session'
import { SECRET_KEY } from './config'
import { UserModule } from './user/user.module'
import { OssModule } from './oss/oss.module'
import { PictureModule } from './picture/picture.module'

@Module({
    imports: [ResponseModule, PrismaModule, UserModule, OssModule, PictureModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    secret: SECRET_KEY,
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        maxAge: 1000 * 60 * 60 * 24 // 24h
                    }
                })
            )
            .forRoutes('*')
    }
}
