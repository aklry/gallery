// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 创建空间 POST /api/v1/space/add */
export async function spaceControllerAddSpaceV1(body: API.CreateSpaceDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.AddSpaceVo>('/api/v1/space/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 更新空间 POST /api/v1/space/update */
export async function spaceControllerUpdateSpaceV1(body: API.UpdateSpaceDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UpdateSpaceVo>('/api/v1/space/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
