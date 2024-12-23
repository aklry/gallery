import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResponseModule } from './response/response.module'
import { PrismaModule } from './prisma/prisma.module'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import { RedisModule } from './redis/redis.module'
import { SECRET_KEY } from './config'
import { UserModule } from './user/user.module'
import { OssModule } from './oss/oss.module'
import { PictureModule } from './picture/picture.module'
import { ExtractModule } from './extract/extract.module'
import { MessageModule } from './message/message.module'
import { RedisService } from './redis/redis.service'
import { CleanModule } from './clean/clean.module'
import { ScheduleModule } from '@nestjs/schedule'
import { RedisCacheModule } from './cache/cache.module'
import { SpaceModule } from './space/space.module'

@Module({
    imports: [
        ResponseModule,
        PrismaModule,
        UserModule,
        OssModule,
        PictureModule,
        ExtractModule,
        MessageModule,
        RedisModule,
        CleanModule,
        ScheduleModule.forRoot(),
        RedisCacheModule,
        SpaceModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private readonly redisService: RedisService) {}
    async configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    store: new RedisStore({
                        client: this.redisService.getClient(),
                        prefix: `huayunjian:session`,
                        ttl: 86400
                    }),
                    secret: SECRET_KEY,
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        maxAge: 86400 * 1000,
                        httpOnly: true,
                        secure: false
                    },
                    genid: () => `user:${Date.now()}`
                })
            )
            .forRoutes('*')
    }
}
