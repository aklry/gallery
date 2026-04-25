import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '@shared/custom-exception'
import { AI_MODEL, AI_MODEL_EDIT, AI_MODEL_GENERATION, BusinessStatus } from '@core/config'
import { AiEditPictureDto, AiExpandPictureCreateTaskDto, AiGeneratePictureDto } from './dto'
import OpenAI from 'openai'
import {
    AiExpandPictureCreatePictureVo,
    AiExpandPictureQueryPictureVo,
    AiGeneratePictureVo,
    AiGeneratePictureSuccessVo
} from './vo'
import { AiEditPictureResponse, AiEditPictureResult } from './type'

@Injectable()
export class AiService {
    private readonly apiKey: string
    private readonly client: OpenAI

    private static readonly CREATE_OUT_PAINTING_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/out-painting'
    private static readonly GET_OUT_PAINTING_TASK_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`

    private static readonly GET_GENERATION_IMAGE_TASK_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
    private static readonly GENERATION_IMAGE_URL = (taskId: string) =>
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`

    private static readonly EDIT_IMAGE_URL =
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('bailian.apiKey')
        this.client = new OpenAI({
            apiKey: this.apiKey,
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        })
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
        } catch (error: any) {
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

    // ==========================================
    // AI 自动生成标签
    // ==========================================
    async generateTags(imageUrl: string): Promise<string[]> {
        try {
            const response = await this.client.chat.completions.create({
                model: 'qwen3-vl-flash', // 阿里云的视觉多模态大模型
                messages: [
                    {
                        role: 'system',
                        content:
                            '你是一个专业的图像打标签助手。请根据提供的图片，提取出最核心、最相关的3个中文标签。只返回一个JSON数组格式的纯文本，例如 ["风景", "二次元", "天空"]，不要包含任何多余的回应文字或Markdown代码块标识。'
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ]
            })

            const content = response.choices[0]?.message?.content
            if (!content) {
                return []
            }
            // 安全解析JSON
            try {
                // 剔除可能大模型习惯性附带的 markdown 格式标识符
                const jsonStr = content
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim()
                const tags = JSON.parse(jsonStr)
                if (Array.isArray(tags)) {
                    return tags
                }
                return []
            } catch (e) {
                console.log('AI 返回的标签解析失败:', content)
                return []
            }
        } catch (error: any) {
            console.log(error)
            throw new BusinessException(error.message || 'AI 分析图片失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }

    // ==========================================
    // AI 编辑图片
    // ==========================================
    async editPicture(input: AiEditPictureDto): Promise<AiEditPictureResult> {
        const { url, prompt } = input
        try {
            const response = await fetch(AiService.EDIT_IMAGE_URL, {
                method: 'POST',
                body: JSON.stringify({
                    model: AI_MODEL_EDIT,
                    input: {
                        messages: [
                            {
                                role: 'user',
                                content: [{ image: url }, { text: prompt }]
                            }
                        ]
                    },
                    parameters: {
                        n: 1,
                        negative_prompt: ' ',
                        prompt_extend: true,
                        watermark: false
                    }
                }),
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            })
            const data: AiEditPictureResponse = await response.json()
            if (!response.ok || data.code) {
                throw new BusinessException(data.message || 'AI 编辑图片失败', BusinessStatus.OPERATION_ERROR.code)
            }
            const images = this.extractEditPictureImages(data)
            if (!images.length) {
                throw new BusinessException('AI 编辑图片失败，未返回图片结果', BusinessStatus.OPERATION_ERROR.code)
            }
            return { images }
        } catch (error: any) {
            if (error instanceof BusinessException) {
                throw error
            }
            console.log(error)
            throw new BusinessException(error.message || 'AI 编辑图片失败', BusinessStatus.OPERATION_ERROR.code)
        }
    }

    private extractEditPictureImages(data: AiEditPictureResponse): string[] {
        return (
            data.output?.choices?.flatMap(choice => {
                return choice.message?.content?.map(item => item.image).filter(Boolean) ?? []
            }) ?? []
        )
    }
}
