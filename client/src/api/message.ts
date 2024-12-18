// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 获取历史消息 GET /api/message/history/message */
export async function messageControllerFindAllHistoryMessage(options?: { [key: string]: any }) {
    return ryRequest.request<API.MessageVo>('/api/message/history/message', {
        method: 'GET',
        ...(options || {})
    })
}

/** 获取最新消息 GET /api/message/new/message */
export async function messageControllerFindAllNewMessage(options?: { [key: string]: any }) {
    return ryRequest.request<API.MessageVo>('/api/message/new/message', {
        method: 'GET',
        ...(options || {})
    })
}

/** 阅读消息 POST /api/message/read/message */
export async function messageControllerReadMessage(body: API.ReadMessageDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.ReadMessageVo>('/api/message/read/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
