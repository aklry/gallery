// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 此处后端没有提供注释 GET /api/v1 */
export async function appControllerGetHelloV1(options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1', {
        method: 'GET',
        ...(options || {})
    })
}
