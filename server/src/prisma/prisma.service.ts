import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import * as log4js from 'log4js'
import { BusinessStatus } from '../config'
import { BusinessException } from '../custom-exception'
import * as path from 'node:path'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = log4js.getLogger('PrismaService')
    constructor() {
        super({
            log: [
                { level: 'query', emit: 'event' },
                { level: 'info', emit: 'event' },
                { level: 'warn', emit: 'event' },
                { level: 'error', emit: 'event' }
            ]
        })
        const isProd = process.env.ENV === 'production'
        log4js.configure({
            appenders: {
                out: {
                    type: 'stdout',
                    layout: {
                        type: 'colored'
                    }
                },
                file: {
                    filename: path.resolve(process.cwd(), 'logs', 'app.log'),
                    type: 'file'
                }
            },
            categories: {
                default: { appenders: isProd ? ['file'] : ['out'], level: 'debug' }
            }
        })
    }
    async onModuleDestroy() {
        this.$disconnect()
    }
    async onModuleInit() {
        await this.$connect()
        // 监听日志事件
        this.$on('query' as never, (e: any) => {
            this.logger.debug('Query: ', e.query)
            this.logger.debug('params: ', e.params)
        })

        this.$on('info' as never, (e: any) => {
            this.logger.info('Info: ', e)
        })

        this.$on('warn' as never, (e: any) => {
            this.logger.warn('Warn: ', e)
        })

        this.$on('error' as never, (e: any) => {
            throw new BusinessException(BusinessStatus.SYSTEM_ERROR.message, BusinessStatus.SYSTEM_ERROR.code)
        })

        // 使用 Prisma Client Extensions 替代 $use
        const extended = this.$extends({
            query: {
                $allModels: {
                    async findUnique({ args, query }) {
                        args.where = { ...args.where, isDelete: 0 }
                        return query(args)
                    },
                    async findFirst({ args, query }) {
                        args.where = { ...args.where, isDelete: 0 }
                        return query(args)
                    },
                    async findMany({ args, query }) {
                        if (args.where && 'isDelete' in args.where) {
                            return query(args)
                        }
                        args.where = { ...args.where, isDelete: 0 }
                        return query(args)
                    },
                    async count({ args, query }) {
                        args.where = { ...args.where, isDelete: 0 }
                        return query(args)
                    },
                    async delete({ model, args }) {
                        // 转换为 update 操作
                        return (this as any)[model].update({
                            ...args,
                            data: { isDelete: 1 }
                        })
                    },
                    async deleteMany({ model, args }) {
                        // 转换为 updateMany 操作
                        return (this as any)[model].updateMany({
                            ...args,
                            data: { isDelete: 1 }
                        })
                    }
                }
            }
        })
        return Object.assign(this, extended)
    }
}
