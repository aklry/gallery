import { Injectable, MessageEvent } from '@nestjs/common'
import { MessageStatus } from '@prisma/client'
import { Request } from 'express'
import { map } from 'rxjs'
import { BusinessStatus } from '@core/config'
import { PrismaService } from '@core/prisma/prisma.service'
import { SseService } from '@infra/sse/sse.service'
import { BusinessException } from '@shared/custom-exception'
import { ReadMessageDto } from './dto/read-message.dto'
import { MessageType } from './enum'
import { MessageVoModel } from './vo/message.vo'

export interface CreateMessageInput {
    userId: string
    title: string
    content: string
    messageType: MessageType
    result?: number
    pictureId?: string
    bizId?: string
    spaceId?: string
    actionUrl?: string
    extra?: Record<string, unknown> | string
    hasRead?: MessageStatus
}

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

        return {
            list: data.map(item => this.toMessageVo(item)),
            total
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

        return {
            list: data.map(item => this.toMessageVo(item)),
            total
        }
    }

    async pushMessage(input: CreateMessageInput) {
        const message = await this.prisma.message.create({
            data: {
                userId: input.userId,
                title: input.title,
                content: input.content,
                hasRead: input.hasRead ?? MessageStatus.UNREAD,
                messageType: input.messageType,
                result: input.result,
                pictureId: input.pictureId,
                bizId: input.bizId,
                spaceId: input.spaceId,
                actionUrl: input.actionUrl,
                extra: this.serializeExtra(input.extra)
            }
        })

        this.sseService.emit({
            userId: input.userId,
            data: {
                id: message.id,
                title: message.title ?? '',
                content: message.content,
                messageType: message.messageType,
                result: message.result ?? undefined,
                spaceId: message.spaceId ?? undefined,
                actionUrl: message.actionUrl ?? undefined
            }
        })

        return message
    }

    async pushMessages(inputs: CreateMessageInput[]) {
        const result = []
        for (const input of inputs) {
            result.push(await this.pushMessage(input))
        }
        return result
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
                        type: 'message'
                    }) as MessageEvent
            )
        )
    }

    private toMessageVo(item: any) {
        return {
            id: item.id,
            content: item.content,
            userId: item.userId,
            hasRead: item.hasRead,
            title: item.title ?? '',
            createTime: item.createTime,
            messageType: item.messageType,
            result: item.result ?? undefined,
            bizId: item.bizId ?? undefined,
            spaceId: item.spaceId ?? undefined,
            actionUrl: item.actionUrl ?? undefined,
            extra: item.extra ?? undefined
        } as MessageVoModel
    }

    private serializeExtra(extra?: Record<string, unknown> | string) {
        if (!extra) {
            return undefined
        }
        return typeof extra === 'string' ? extra : JSON.stringify(extra)
    }
}
