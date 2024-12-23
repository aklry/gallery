import { Injectable } from '@nestjs/common'
import { MessageStatus } from '@prisma/client'
import { Request } from 'express'
import { BusinessStatus } from '../config'
import { BusinessException } from '../custom-exception'
import { PrismaService } from '../prisma/prisma.service'
import { ReadMessageDto } from './dto/read-message.dto'
import { MessageVoModel } from './vo/message.vo'
@Injectable()
export class MessageService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllNewMessage(req: Request) {
        const user = req.session.user
        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where: {
                    createTime: {
                        equals: new Date().toISOString()
                    },
                    userId: user.id
                }
            }),
            this.prisma.message.count({
                where: {
                    userId: user.id
                }
            })
        ])
        if (data.length > 0) {
            return {
                list: data.map(
                    item =>
                        ({
                            id: item.id,
                            content: item.content,
                            userId: item.userId,
                            hasRead: item.hasRead,
                            title: item.title
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

    async findAllHistoryMessage(req: Request) {
        const user = req.session.user
        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where: {
                    userId: user.id,
                    createTime: {
                        lte: new Date().toISOString()
                    }
                }
            }),
            this.prisma.message.count({
                where: {
                    userId: user.id
                }
            })
        ])
        if (data.length > 0) {
            return {
                list: data.map(
                    item =>
                        ({
                            id: item.id,
                            content: item.content,
                            userId: item.userId,
                            hasRead: item.hasRead,
                            title: item.title
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
}
