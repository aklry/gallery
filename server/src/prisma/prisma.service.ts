import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import * as log4js from 'log4js'
import { BusinessStatus } from '../config'
import { BusinessException } from '../custom-exception'

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
        log4js.configure({
            appenders: {
                out: {
                    type: 'stdout',
                    layout: {
                        type: 'colored'
                    }
                },
                file: {
                    filename: 'logs/app.log',
                    type: 'file'
                }
            },
            categories: {
                default: { appenders: ['out', 'file'], level: 'debug' }
            }
        })
    }
    async onModuleDestroy() {
        this.$disconnect()
    }
    async onModuleInit() {
        await this.$connect()
        if (process.env.NODE_ENV === 'development') {
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
        }
        // 添加中间件处理软删除
        this.$use(async (params, next) => {
            // 查询操作添加 isDelete = 0 条件
            if (params.action === 'findUnique' || params.action === 'findFirst') {
                // 改为 findFirst 操作
                params.action = 'findFirst'
                // 添加 isDelete 条件
                params.args.where = { ...params.args.where, isDelete: 0 }
            }

            if (params.action === 'findMany') {
                // 添加 isDelete 条件
                if ('isDelete' in params.args.where) {
                    return next(params)
                }
                params.args.where = { ...params.args.where, isDelete: 0 }
            }

            if (params.action === 'count') {
                params.args.where = { ...params.args.where, isDelete: 0 }
            }

            // 删除操作改为更新 isDelete = 1
            if (params.action === 'delete') {
                // 转换为 update 操作
                params.action = 'update'
                params.args['data'] = { isDelete: 1 }
            }

            if (params.action === 'deleteMany') {
                // 转换为 updateMany 操作
                params.action = 'updateMany'
                params.args['data'] = { isDelete: 1 }
            }

            return next(params)
        })
    }
}
