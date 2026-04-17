import { Module, Global } from '@nestjs/common'
import { RedisCacheService } from './cache.service'
import { CacheModule } from '@nestjs/cache-manager'

@Global()
@Module({
    providers: [RedisCacheService],
    imports: [
        CacheModule.register({
            ttl: 3600000,
            max: 100
        })
    ],
    exports: [RedisCacheService]
})
export class RedisCacheModule {}
