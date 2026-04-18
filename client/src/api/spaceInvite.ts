// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 获取当前有效空间邀请码 GET /api/v1/space-invite/current */
export async function spaceInviteControllerCurrentV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.SpaceInviteControllerCurrentV1Params,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceInviteCodeVo>('/api/v1/space-invite/current', {
        method: 'GET',
        params: {
            ...params
        },
        ...(options || {})
    })
}

/** 使当前空间邀请码失效 POST /api/v1/space-invite/disable */
export async function spaceInviteControllerDisableV1(body: API.ManageSpaceInviteDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.DisableSpaceInviteVo>('/api/v1/space-invite/disable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 生成空间邀请码 POST /api/v1/space-invite/generate */
export async function spaceInviteControllerGenerateV1(
    body: API.GenerateSpaceInviteDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceInviteCodeVo>('/api/v1/space-invite/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 通过邀请码加入团队空间 POST /api/v1/space-invite/join */
export async function spaceInviteControllerJoinV1(body: API.JoinSpaceInviteDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.JoinSpaceInviteVo>('/api/v1/space-invite/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
