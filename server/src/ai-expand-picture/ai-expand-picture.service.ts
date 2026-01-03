import { Injectable } from '@nestjs/common'
import { AiExpandPictureCreateTaskDto } from './dto'
import { AI_MODEL, BusinessStatus } from '../config'
import { AiExpandPictureCreatePictureVo, AiExpandPictureQueryPictureVo } from './vo'
import { BusinessException } from '../custom-exception'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AiExpandPictureService {
    private static readonly CREATE_OUT_PAINTING_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting'
    private static readonly GET_OUT_PAINTING_TASK_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`
    private readonly apiKey: string
    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('bailian.apiKey')
    }

    async createOutPaintingTask(input: AiExpandPictureCreateTaskDto): Promise<AiExpandPictureCreatePictureVo> {
        try {
            const res = await fetch(AiExpandPictureService.CREATE_OUT_PAINTING_TASK_URL, {
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
            const url = AiExpandPictureService.GET_OUT_PAINTING_TASK_URL(taskId)
            const data = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
            const res: AiExpandPictureQueryPictureVo = await data.json()
            return res
        } catch (error) {
            console.log(error.response.data)
            throw new BusinessException('获取扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
