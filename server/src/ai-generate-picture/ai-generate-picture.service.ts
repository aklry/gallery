import { Injectable } from '@nestjs/common'
import { BusinessException } from '../custom-exception'
import { AI_MODEL_GENERATION, BusinessStatus } from '../config'
import { AiGeneratePictureDto } from './dto'
import axios, { AxiosResponse } from 'axios'
import { AiGeneratePictureVo, AiGeneratePictureSuccessVo } from './vo'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AiGeneratePictureService {
    private static readonly GET_GENERATION_IMAGE_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
    private static readonly GENERATION_IMAGE_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`
    private readonly apiKey: string

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('bailian.apiKey')
    }
    async getGenerateImageTask(input: AiGeneratePictureDto) {
        try {
            const res: AxiosResponse<AiGeneratePictureVo> = await axios({
                url: AiGeneratePictureService.GET_GENERATION_IMAGE_TASK_URL,
                method: 'POST',
                data: {
                    model: AI_MODEL_GENERATION,
                    input: {
                        prompt: input.text
                    },
                    parameters: {
                        size: '1024*1024',
                        n: 1
                    }
                },
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-DashScope-Async': 'enable'
                }
            })
            if (res.status !== 200) {
                throw new BusinessException('生成图片失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return res.data
        } catch (error: any) {
            console.log(error)
            throw new BusinessException(error.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }

    async generateImage(taskId: string) {
        try {
            const res: AxiosResponse<AiGeneratePictureSuccessVo> = await axios({
                url: AiGeneratePictureService.GENERATION_IMAGE_URL(taskId),
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
            if (res.status !== 200) {
                throw new BusinessException('生成图片失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return res.data
        } catch (error: any) {
            console.log(error)
            throw new BusinessException(error.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
