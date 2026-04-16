import { Injectable } from '@nestjs/common'
import { AiCreateTagDto } from './dto'
import { ResponseService } from '../response/response.service'
import { BusinessException } from 'src/custom-exception'
import { BusinessStatus } from 'src/config'

@Injectable()
export class TagService {
    constructor(private readonly response: ResponseService) {}

    async aiCreateTag(aiCreateTagDto: AiCreateTagDto) {
        const { picUrl } = aiCreateTagDto
        if (!picUrl) {
            throw new BusinessException('图片url不能为空', BusinessStatus.PARAMS_ERROR.code)
        }
        return this.response.success('aiCreateTag')
    }
}
