import { Injectable } from '@nestjs/common'
import { AiCreateTagDto } from './dto'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { AiService } from '../ai/ai.service'
import { PrismaService } from '../prisma/prisma.service'
import { GetTagVoModel } from './vo'
import { LoginVoModel } from '../user/vo'

@Injectable()
export class TagService {
    constructor(
        private readonly aiService: AiService,
        private prisma: PrismaService
    ) {}

    async aiCreateTag(aiCreateTagDto: AiCreateTagDto, user: LoginVoModel) {
        const { picUrl, picId } = aiCreateTagDto
        if (!picUrl) {
            throw new BusinessException('图片url不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        const tags = await this.aiService.generateTags(picUrl)
        // 只有 AI 真正返回了标签，再去插关系表，省开销
        if (tags && tags.length > 0) {
            // 保存到tag表
            await this.prisma.tag.createMany({
                data: tags.map(tagName => ({
                    tagName,
                    isSystem: 1,
                    userId: user.id,
                    useCount: 1
                })),
                skipDuplicates: true
            })
            // 【新增同步更新用量】针对库里面本来就在这次被 AI 选中的老标签，增加他们的热度
            await this.prisma.tag.updateMany({
                where: { tagName: { in: tags } },
                data: { useCount: { increment: 1 } }
            })
            // 保存到picture_tag表
            const dbTags = await this.prisma.tag.findMany({
                where: {
                    tagName: {
                        in: tags
                    }
                }
            })
            await this.prisma.picture_tag.createMany({
                data: dbTags.map(tag => ({
                    tagId: tag.id,
                    pictureId: picId
                })),
                skipDuplicates: true
            })
            return tags
        }
        return [] as string[]
    }

    async getPictureTags() {
        const res = await this.prisma.tag.findMany({
            take: 30,
            orderBy: {
                useCount: 'desc'
            },
            select: {
                id: true,
                tagName: true,
                isSystem: true
            }
        })
        return res.map(item => ({
            id: item.id,
            tagName: item.tagName,
            isSystem: !!item.isSystem
        })) as GetTagVoModel[]
    }
}
