import { Injectable } from '@nestjs/common'
import { CreatePictureCollectionDto } from './dto/create-picture-collection.dto'
import type { Request } from 'express'
import { ResponseService } from '../response/response.service'
import { PrismaService } from '../prisma/prisma.service'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { UserActionStatus } from '@prisma/client'

@Injectable()
export class PictureCollectionService {
    constructor(
        private readonly response: ResponseService,
        private readonly prisma: PrismaService
    ) {}

    async favoritePictureCollection(createPictureCollectionDto: CreatePictureCollectionDto, req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }

        const { pictureId, status } = createPictureCollectionDto
        const userId = user.id
        const now = new Date()
        const willActive = status === UserActionStatus.ACTIVE

        const existing = await this.prisma.picture_favorite.findFirst({
            where: {
                pictureId,
                userId,
                isDelete: {
                    in: [0, 1]
                }
            }
        })

        const wasActive = !!existing && existing.status === UserActionStatus.ACTIVE && existing.isDelete === 0
        const nextIsDelete = willActive ? 0 : 1
        const increment = !wasActive && willActive ? 1 : wasActive && !willActive ? -1 : 0

        if (!existing && !willActive) {
            return this.response.success(false, '取消收藏成功')
        }

        const operations = []

        if (!existing) {
            operations.push(
                this.prisma.picture_favorite.create({
                    data: {
                        pictureId,
                        userId,
                        status,
                        isDelete: nextIsDelete,
                        createTime: now,
                        updateTime: now
                    }
                })
            )
        } else if (existing.status !== status || existing.isDelete !== nextIsDelete) {
            operations.push(
                this.prisma.picture_favorite.update({
                    where: {
                        id: existing.id
                    },
                    data: {
                        status,
                        isDelete: nextIsDelete,
                        updateTime: now
                    }
                })
            )
        }

        if (increment !== 0) {
            operations.push(
                this.prisma.picture.update({
                    where: {
                        id: pictureId
                    },
                    data: {
                        collectionNumber: {
                            increment
                        }
                    }
                })
            )
        }

        if (operations.length > 0) {
            await this.prisma.$transaction(operations)
        }

        return this.response.success(willActive, willActive ? '收藏成功' : '取消收藏成功')
    }
}
