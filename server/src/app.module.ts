import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResponseModule } from '@core/response/response.module'
import { PrismaModule } from '@core/prisma/prisma.module'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import { RedisModule } from '@core/redis/redis.module'
import { SECRET_KEY } from '@core/config'
import { UserModule } from '@identity/user/user.module'
import { OssModule } from '@infra/oss/oss.module'
import { PictureModule } from '@gallery/picture/picture.module'
import { ExtractModule } from '@tools/extract/extract.module'
import { MessageModule } from '@tools/message/message.module'
import { RedisService } from '@core/redis/redis.service'
import { CleanModule } from '@tools/clean/clean.module'
import { ScheduleModule } from '@nestjs/schedule'
import { RedisCacheModule } from '@core/cache/cache.module'
import { SpaceModule } from '@space/core/space.module'
import { AnalyzeModule } from '@tools/analyze/analyze.module'
import { SpaceUserModule } from '@space/user/space-user.module'
import { PermissionModule } from '@identity/permission/permission.module'
import { load } from 'js-yaml'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { YamlOssConfig } from '@shared/types'
import { SseModule } from '@infra/sse/sse.module'
import { EmailModule } from '@infra/email/email.module'
import { SeoModule } from '@tools/seo/seo.module'
import { PictureCollectionModule } from '@gallery/collection/picture-collection.module'
import { PictureLikeModule } from '@gallery/like/picture-like.module'
import { PictureDownloadModule } from '@gallery/download/picture-download.module'
import { TagModule } from '@gallery/tag/tag.module'
import { AiModule } from '@infra/ai/ai.module'

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
        SpaceModule,
        AnalyzeModule,
        SpaceUserModule,
        PermissionModule,
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development', '.env.production'],
            isGlobal: true,
            load: [() => load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8')) as YamlOssConfig]
        }),
        SseModule,
        EmailModule,
        SeoModule,
        PictureCollectionModule,
        PictureLikeModule,
        PictureDownloadModule,
        TagModule,
        AiModule
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
