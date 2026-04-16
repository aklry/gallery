import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '../custom-exception'
import { AI_MODEL, AI_MODEL_GENERATION, BusinessStatus } from '../config'
import { AiExpandPictureCreateTaskDto, AiGeneratePictureDto } from './dto'
import {
    AiExpandPictureCreatePictureVo,
    AiExpandPictureQueryPictureVo,
    AiGeneratePictureVo,
    AiGeneratePictureSuccessVo
} from './vo'

@Injectable()
export class AiService {
    private readonly apiKey: string

    private static readonly CREATE_OUT_PAINTING_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting'
    private static readonly GET_OUT_PAINTING_TASK_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`

    private static readonly GET_GENERATION_IMAGE_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
    private static readonly GENERATION_IMAGE_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('bailian.apiKey')
    }

    // ==========================================
    // AI 扩图功能 (Out-painting)
    // ==========================================
    async createOutPaintingTask(input: AiExpandPictureCreateTaskDto): Promise<AiExpandPictureCreatePictureVo> {
        try {
            const res = await fetch(AiService.CREATE_OUT_PAINTING_TASK_URL, {
                method: 'POST',
                body: JSON.stringify({
                    model: AI_MODEL,
                    input: {
                        image_url: input.url
                    },
                    parameters: {
                        x_scale: input.xScale,
                        y_scale: input.yScale,
                        best_quantity: false,
                        limit_image_size: true,
                        add_watermark: false
                    }
                }),
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'X-DashScope-Async': 'enable',
                    'Content-Type': 'application/json'
                }
            })
            const data: AiExpandPictureCreatePictureVo = await res.json()
            if (data.output.task_status === 'FAILED') {
                throw new BusinessException('创建扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return data
        } catch (error) {
            throw new BusinessException('创建扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }

    async getOutPaintingTask(taskId: string): Promise<AiExpandPictureQueryPictureVo> {
        try {
            const url = AiService.GET_OUT_PAINTING_TASK_URL(taskId)
            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
            const res: AiExpandPictureQueryPictureVo = await data.json()
            return res
        } catch (error) {
            console.log(error.response?.data)
            throw new BusinessException('获取扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }

    // ==========================================
    // AI 文生图功能 (Image Generation)
    // ==========================================
    async getGenerateImageTask(input: AiGeneratePictureDto): Promise<AiGeneratePictureVo> {
        try {
            const data = await fetch(AiService.GET_GENERATION_IMAGE_TASK_URL, {
                method: 'POST',
                body: JSON.stringify({
                    model: AI_MODEL_GENERATION,
                    input: {
                        prompt: input.text
                    },
                    parameters: {
                        size: '1024*1024',
                        n: 1
                    }
                }),
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-DashScope-Async': 'enable'
                }
            })
            const res: AiGeneratePictureVo = await data.json()
            if (res.output.task_status === 'FAILED') {
                throw new BusinessException('生成图片失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return res
        } catch (error: any) {
            console.log(error)
            throw new BusinessException(error.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }

    async generateImage(taskId: string): Promise<AiGeneratePictureSuccessVo> {
        try {
            const response = await fetch(AiService.GENERATION_IMAGE_URL(taskId), {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
            if (!response.ok) {
                throw new BusinessException('生成图片失败', BusinessStatus.OPERATION_ERROR.code)
            }
            const res: AiGeneratePictureSuccessVo = await response.json()
            return res
        } catch (error: any) {
            console.log(error)
            throw new BusinessException(error.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
