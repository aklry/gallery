import { Injectable } from '@nestjs/common'
import { MessageStatus } from '@prisma/client'
import { Request } from 'express'
import { BusinessStatus } from '@core/config'
import { BusinessException } from '@shared/custom-exception'
import { PrismaService } from '@core/prisma/prisma.service'
import { ReadMessageDto } from './dto/read-message.dto'
import { MessageVoModel } from './vo/message.vo'
import { SseService } from '@infra/sse/sse.service'
import { MessageEvent } from '@nestjs/common'
import { map } from 'rxjs'

@Injectable()
export class MessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly sseService: SseService
    ) {}

    async findAllNewMessage(req: Request, page: number = 1, pageSize: number = 50) {
        const user = req.session.user
        const whereCondition = {
            userId: user.id,
            hasRead: MessageStatus.UNREAD
        }

        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where: whereCondition,
                orderBy: { createTime: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize
            }),
            this.prisma.message.count({
                where: whereCondition
            })
        ])

        if (data.length > 0) {
            const pictureIds = data.map(item => item.pictureId).filter(id => id !== null) as string[]
            const pictures = await this.prisma.picture.findMany({
                where: {
                    id: { in: pictureIds }
                }
            })
            const pictureMap = new Map(pictures.map(picture => [picture.id, picture.reviewStatus]))
            return {
                list: data.map(
                    item =>
                        ({
                            id: item.id,
                            content: item.content,
                            userId: item.userId,
                            hasRead: item.hasRead,
                            title: item.title,
                            createTime: item.createTime,
                            result: pictureMap.get(item.pictureId) || 0
                        }) as MessageVoModel
                ),
                total
            }
        }
        return {
            list: [],
            total: 0
        }
    }

    async findAllHistoryMessage(req: Request, page: number = 1, pageSize: number = 50) {
        const user = req.session.user
        const whereCondition = {
            userId: user.id,
            hasRead: MessageStatus.READ
        }
        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where: whereCondition,
                orderBy: { createTime: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize
            }),
            this.prisma.message.count({
                where: whereCondition
            })
        ])
        if (data.length > 0) {
            const pictureIds = data.map(item => item.pictureId).filter(id => id !== null) as string[]
            const pictures = await this.prisma.picture.findMany({
                where: {
                    id: { in: pictureIds }
                }
            })
            const pictureMap = new Map(pictures.map(picture => [picture.id, picture.reviewStatus]))
            return {
                list: data.map(
                    item =>
                        ({
                            id: item.id,
                            content: item.content,
                            userId: item.userId,
                            hasRead: item.hasRead,
                            title: item.title,
                            createTime: item.createTime,
                            result: pictureMap.get(item.pictureId) || 0
                        }) as MessageVoModel
                ),
                total
            }
        }
        return {
            list: [],
            total: 0
        }
    }

    async readMessage(readMessageDto: ReadMessageDto) {
        const { id } = readMessageDto
        const message = await this.prisma.message.findUnique({
            where: {
                id
            }
        })
        if (!message) {
            throw new BusinessException('消息不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const result = await this.prisma.message.update({
            where: {
                id
            },
            data: {
                hasRead: MessageStatus.READ
            }
        })
        if (!result) {
            throw new BusinessException('消息已读失败', BusinessStatus.PARAMS_ERROR.code)
        }
        return true
    }

    async readAllMessage(req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const result = await this.prisma.message.updateMany({
            where: {
                userId: user.id
            },
            data: {
                hasRead: MessageStatus.READ
            }
        })
        if (!result) {
            throw new BusinessException('消息已读失败', BusinessStatus.PARAMS_ERROR.code)
        }
        return true
    }

    streamMessages(userId: string) {
        return this.sseService.subscribe(userId).pipe(
            map(
                event =>
                    ({
                        data: event.data,
                        type: 'message' // 事件类型
                    }) as MessageEvent
            )
        )
    }
}
