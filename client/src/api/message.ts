// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 获取历史消息 GET /api/v1/message/history/message */
export async function messageControllerFindAllHistoryMessageV1(
    body: API.PageRequestPick,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.MessageVo>('/api/v1/message/history/message', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取最新消息 GET /api/v1/message/new/message */
export async function messageControllerFindAllNewMessageV1(
    body: API.PageRequestPick,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.MessageVo>('/api/v1/message/new/message', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 全部已读 POST /api/v1/message/read/all/message */
export async function messageControllerReadAllMessageV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.ReadAllMessageVo>('/api/v1/message/read/all/message', {
        method: 'POST',
        ...(options || {})
    })
}

/** 阅读消息 POST /api/v1/message/read/message */
export async function messageControllerReadMessageV1(body: API.ReadMessageDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.ReadMessageVo>('/api/v1/message/read/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /api/v1/message/stream */
export async function messageControllerStreamMessagesV1(options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1/message/stream', {
        method: 'GET',
        ...(options || {})
    })
}
