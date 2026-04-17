import { Injectable, OnModuleInit } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'
@Injectable()
export class RedisService implements OnModuleInit {
    private redisClient: RedisClientType
    constructor() {
        this.redisClient = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            },
            database: 0,
            password: process.env.REDIS_PASSWORD || ''
        })
        this.redisClient.on('error', error => {
            console.error('Redis connection failed', error)
        })
        this.redisClient.on('connect', () => {
            console.log('Redis connection successful')
        })
    }
    async onModuleInit() {
        await this.redisClient.connect()
    }

    getClient(): RedisClientType {
        return this.redisClient
    }

    // 添加一些常用的方法
    async set(key: string, value: any, ttl: number = 60 * 60 * 24) {
        return await this.redisClient.set(key, JSON.stringify(value), {
            EX: ttl
        })
    }

    async get(key: string) {
        const value = await this.redisClient.get(key)
        return value ? JSON.parse(value) : null
    }

    async incr(key: string) {
        return await this.redisClient.incr(key)
    }

    async expire(key: string, ttl: number) {
        return await this.redisClient.expire(key, ttl)
    }

    async ttl(key: string) {
        return await this.redisClient.ttl(key)
    }

    async del(key: string) {
        return await this.redisClient.del(key)
    }
}
