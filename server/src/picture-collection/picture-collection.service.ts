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

        await this.prisma.$transaction(async tx => {
            const existing = await tx.picture_favorite.findUnique({
                where: {
                    pictureId_userId: {
                        pictureId,
                        userId
                    }
                }
            })

            let increment = 0

            if (!existing) {
                await tx.picture_favorite.create({
                    data: {
                        pictureId,
                        userId,
                        status,
                        createTime: new Date(),
                        updateTime: new Date()
                    }
                })

                if (status === UserActionStatus.ACTIVE) {
                    increment = 1
                }
            } else {
                if (existing.status !== status) {
                    increment = status === UserActionStatus.ACTIVE ? 1 : -1
                }

                await tx.picture_favorite.update({
                    where: {
                        pictureId_userId: {
                            pictureId,
                            userId
                        }
                    },
                    data: {
                        status,
                        updateTime: new Date()
                    }
                })
            }

            if (increment !== 0) {
                await tx.picture.update({
                    where: {
                        id: pictureId
                    },
                    data: {
                        collectionNumber: {
                            increment
                        }
                    }
                })
            }
        })

        return this.response.success(null, status === UserActionStatus.ACTIVE ? '收藏成功' : '取消收藏成功')
    }
}
