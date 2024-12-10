// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 此处后端没有提供注释 GET /api/v1/user/${param0} */
export async function userControllerGetUserByIdV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UserControllerGetUserByIdV1Params,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<API.User>(`/api/v1/user/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/add */
export async function userControllerAddUserV1(body: API.CreateUserDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserCreateVo>('/api/v1/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/delete */
export async function userControllerDeleteUserV1(body: API.DeleteRequest, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserDeleteVo>('/api/v1/user/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /api/v1/user/get/login */
export async function userControllerGetLoginUserV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.UserLoginVo>('/api/v1/user/get/login', {
        method: 'GET',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /api/v1/user/get/vo */
export async function userControllerGetUserVoByIdV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.UserControllerGetUserVoByIdV1Params,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.UserVoModel>('/api/v1/user/get/vo', {
        method: 'GET',
        params: {
            ...params
        },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/list/page/vo */
export async function userControllerGetUserByPageV1(body: API.FindUserDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserVo>('/api/v1/user/list/page/vo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/login */
export async function userControllerUserLoginV1(body: API.UserLoginDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserLoginVo>('/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/logout */
export async function userControllerUserLogoutV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.UserLogoutVo>('/api/v1/user/logout', {
        method: 'POST',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/register */
export async function userControllerUserRegisterV1(body: API.UserRegisterDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserRegisterVo>('/api/v1/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/user/update */
export async function userControllerUpdateUserV1(body: API.UpdateUserDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UserUpdateVo>('/api/v1/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
