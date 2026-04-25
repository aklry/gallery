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

/** 获取空间排行 POST /api/v1/analyze/rank */
export async function analyzeControllerGetSpaceRankAnalyzeV1(
    body: API.SpaceRankAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceRankAnalyzeVo>('/api/v1/analyze/rank', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取空间大小分析 POST /api/v1/analyze/size */
export async function analyzeControllerGetSpaceSizeAnalyzeV1(
    body: API.SpaceSizeAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceSizeAnalyzeVo>('/api/v1/analyze/size', {
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

/** 获取用户空间使用分析 POST /api/v1/analyze/user */
export async function analyzeControllerGetUserAnalyzeV1(
    body: API.SpaceUserAnalyzeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.SpaceUserAnalyzeVo>('/api/v1/analyze/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
