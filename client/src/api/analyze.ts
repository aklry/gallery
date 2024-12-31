// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 获取空间分类分析 POST /api/v1/analyze/category */
export async function analyzeControllerGetSpaceCategoryAnalyzeV1(
    body: API.SpaceCategoryAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceCategoryAnalyzeVo>('/api/v1/analyze/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间标签分析 POST /api/v1/analyze/tag */
export async function analyzeControllerGetSpaceTagAnalyzeV1(
    body: API.SpaceCategoryAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceTagAnalyzeVo>('/api/v1/analyze/tag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间使用情况 POST /api/v1/analyze/usage */
export async function analyzeControllerGetSpaceUsageAnalyzeV1(
    body: API.SpaceUsageAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceUsageAnalyzeVo>('/api/v1/analyze/usage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
