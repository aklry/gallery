import { Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { CreatePictureDownloadDto } from './dto/create-picture-download.dto'
import { ResponseService } from '@core/response/response.service'
import { PrismaService } from '@core/prisma/prisma.service'
import { BusinessException } from '@shared/custom-exception'
import { BusinessStatus } from '@core/config'

@Injectable()
export class PictureDownloadService {
    constructor(
        private readonly response: ResponseService,
        private readonly prisma: PrismaService
    ) {}

    async recordPictureDownload(createPictureDownloadDto: CreatePictureDownloadDto, req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }

        const { pictureId } = createPictureDownloadDto
        const picture = await this.prisma.picture.findFirst({
            where: {
                id: pictureId,
                isDelete: 0
            },
            select: {
                id: true
            }
        })

        if (!picture) {
            throw new BusinessException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }

        const now = new Date()

        await this.prisma.$transaction([
            this.prisma.picture_download.create({
                data: {
                    pictureId,
                    userId: user.id,
                    createTime: now,
                    isDelete: 0
                }
            }),
            this.prisma.picture.update({
                where: {
                    id: pictureId
                },
                data: {
                    downloadNumber: {
                        increment: 1
                    }
                }
            })
        ])

        return this.response.success(true, '记录下载成功')
    }
}
