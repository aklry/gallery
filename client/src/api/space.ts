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

/** 删除空间 POST /api/v1/space/delete */
export async function spaceControllerDeleteSpaceV1(body: API.DeleteSpaceDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.DeleteSpaceVo>('/api/v1/space/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 编辑空间 POST /api/v1/space/edit */
export async function spaceControllerEditSpaceV1(body: API.EditSpaceDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.EditSpaceVo>('/api/v1/space/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间等级列表 GET /api/v1/space/list/level */
export async function spaceControllerListSpaceLevelV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.SpaceLevelVo>('/api/v1/space/list/level', {
        method: 'GET',
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
