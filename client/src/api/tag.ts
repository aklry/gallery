// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** AI生成标签 POST /api/v1/tag/ai-create */
export async function tagControllerAiCreateTagV1(body: API.AiCreateTagDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.AiCreateTagVo>('/api/v1/tag/ai-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
