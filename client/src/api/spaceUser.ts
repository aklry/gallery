// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 添加空间成员 POST /api/v1/space-user/add */
export async function spaceUserControllerAddSpaceUserV1(body: API.AddSpaceUserDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.AddSpaceUserVo>('/api/v1/space-user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 删除空间成员 POST /api/v1/space-user/delete */
export async function spaceUserControllerDeleteSpaceUserV1(
    body: API.DeleteSpaceUserDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.DeleteSpaceUserVo>('/api/v1/space-user/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 修改空间成员权限 POST /api/v1/space-user/edit */
export async function spaceUserControllerEditSpaceUserAuthV1(
    body: API.EditSpaceUserDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.EditSpaceUserVo>('/api/v1/space-user/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间成员 POST /api/v1/space-user/get */
export async function spaceUserControllerGetOneSpaceUserV1(
    body: API.QuerySpaceUserDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceUserEntitiesVo>('/api/v1/space-user/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间成员列表 POST /api/v1/space-user/list */
export async function spaceUserControllerGetSpaceUserListV1(
    body: API.QuerySpaceUserDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceUserListVo>('/api/v1/space-user/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取我加入的空间 POST /api/v1/space-user/list/my */
export async function spaceUserControllerGetMyAddTeamV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.SpaceUserListVo>('/api/v1/space-user/list/my', {
        method: 'POST',
        ...(options || {})
    })
}
