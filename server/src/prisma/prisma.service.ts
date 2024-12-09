import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import * as log4js from 'log4js'
import { BusinessStatus } from '../config'
import { DaoErrorException } from '../custom-exception'

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
                throw new DaoErrorException(BusinessStatus.SYSTEM_ERROR.message, BusinessStatus.SYSTEM_ERROR.code)
            })
        }
    }
}
