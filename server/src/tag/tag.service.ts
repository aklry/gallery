import { Injectable } from '@nestjs/common'
import { AiCreateTagDto } from './dto'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { AiService } from '../ai/ai.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TagService {
    constructor(
        private readonly aiService: AiService,
        private prisma: PrismaService
    ) {}

    async aiCreateTag(aiCreateTagDto: AiCreateTagDto) {
        const { picUrl } = aiCreateTagDto
        if (!picUrl) {
            throw new BusinessException('图片url不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        return await this.aiService.generateTags(picUrl)
    }

    async getPictureTags() {
        return await this.prisma.tag.findMany({
            take: 50,
            orderBy: {
                useCount: 'desc'
            }
        })
    }
}
