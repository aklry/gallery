import { Injectable } from '@nestjs/common'
import { getApiLey } from '../utils'
import { AiExpandPictureCreateTaskDto } from './dto'
import { AI_MODEL, BusinessStatus } from '../config'
import { AiExpandPictureCreatePictureVo, AiExpandPictureQueryPictureVo } from './vo'
import { BusinessException } from '../custom-exception'
import axios from 'axios'

@Injectable()
export class AiExpandPictureService {
    private readonly apiKey: string = getApiLey()
    public static readonly CREATE_OUT_PAINTING_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting'
    public static readonly GET_OUT_PAINTING_TASK_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`

    async createOutPaintingTask(input: AiExpandPictureCreateTaskDto) {
        try {
            const res = await axios({
                url: AiExpandPictureService.CREATE_OUT_PAINTING_TASK_URL,
                method: 'POST',
                data: {
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
                },
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'X-DashScope-Async': 'enable',
                    'Content-Type': 'application/json'
                }
            })
            if (res.status !== 200) {
                throw new BusinessException('创建扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return res.data as AiExpandPictureCreatePictureVo
        } catch (error) {
            console.log(error.response.data)
            throw new BusinessException('创建扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }

    async getOutPaintingTask(taskId: string) {
        try {
            const url = AiExpandPictureService.GET_OUT_PAINTING_TASK_URL(taskId)
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            })
            if (res.status !== 200) {
                throw new BusinessException('获取扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
            }
            return res.data as AiExpandPictureQueryPictureVo
        } catch (error) {
            console.log(error.response.data)
            throw new BusinessException('获取扩图任务失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
