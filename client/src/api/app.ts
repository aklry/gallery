import ryRequest from '../services'

/** 此处后端没有提供注释 GET /api/v1 */
export async function appControllerGetHelloV1(options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1', {
        method: 'GET',
        ...(options || {})
    })
}

/** 测试 返回值: 测试成功 GET /api/v1/test */
export async function appControllerTestV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.ResponseData>('/api/v1/test', {
        method: 'GET',
        ...(options || {})
    })
}
