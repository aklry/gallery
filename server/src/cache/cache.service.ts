import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
    /**
     * 获取缓存数据
     * @param key 缓存键
     */
    async get<T>(key: string): Promise<T | undefined> {
        return await this.cacheManager.get<T>(key)
    }
    /**
     * 设置缓存数据
     * @param key 缓存键
     * @param value 缓存值
     * @param ttl 过期时间（毫秒）
     */
    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl)
    }
    /**
     * 删除缓存数据
     * @param key 缓存键
     */
    async del(key: string): Promise<void> {
        await this.cacheManager.del(key)
    }
    /**
     * 获取缓存数据，如果不存在则通过回调函数获取并缓存
     * @param key 缓存键
     * @param callback 回调函数，用于获取数据
     * @param ttl 过期时间（毫秒）
     */
    async getOrSet<T>(key: string, callback: () => Promise<T>, ttl?: number): Promise<T> {
        const value = await this.get<T>(key)
        if (value !== undefined) {
            return value
        }
        const newValue = await callback()
        await this.set(key, newValue, ttl)
        return newValue
    }
}
