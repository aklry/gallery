// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 删除图片(管理员) POST /api/v1/picture/delete */
export async function pictureControllerDeletePictureV1(body: API.DeletePictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.DeletePictureVo>('/api/v1/picture/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 更新图片(非管理员) POST /api/v1/picture/edit */
export async function pictureControllerEditPictureV1(body: API.UpdatePictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UpdatePictureVo>('/api/v1/picture/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 根据id获取图片(管理员) GET /api/v1/picture/get/${param0} */
export async function pictureControllerGetByIdV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureControllerGetByIdV1Params,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<API.GetPictureVo>(`/api/v1/picture/get/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 根据id获取图片(非管理员) GET /api/v1/picture/get/vo/${param0} */
export async function pictureControllerGetByIdVoV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureControllerGetByIdVoV1Params,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<API.GetPictureVo>(`/api/v1/picture/get/vo/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 获取图片列表(管理员) POST /api/v1/picture/list/page */
export async function pictureControllerGetPictureByPageV1(body: API.QueryPictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.PictureVo>('/api/v1/picture/list/page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取图片列表(非管理员) POST /api/v1/picture/list/page/vo */
export async function pictureControllerGetPictureByPageVoV1(
    body: API.QueryPictureDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.ShowPictureVo>('/api/v1/picture/list/page/vo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 审核图片(管理员) POST /api/v1/picture/review */
export async function pictureControllerReviewPictureV1(body: API.ReviewPictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1/picture/review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 获取图片标签和分类 GET /api/v1/picture/tag_category */
export async function pictureControllerListPictureTagCategoryV1(options?: { [key: string]: any }) {
    return ryRequest.request<API.TagCategoryListVo>('/api/v1/picture/tag_category', {
        method: 'GET',
        ...(options || {})
    })
}

/** 更新图片(管理员) POST /api/v1/picture/update */
export async function pictureControllerUpdatePictureV1(body: API.UpdatePictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<API.UpdatePictureVo>('/api/v1/picture/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 上传图片 POST /api/v1/picture/upload */
export async function pictureControllerUploadFileV1(
    body: {
        id?: string
    },
    file?: File,
    options?: { [key: string]: any }
) {
    const formData = new FormData()

    if (file) {
        formData.append('file', file)
    }

    Object.keys(body).forEach(ele => {
        const item = (body as any)[ele]

        if (item !== undefined && item !== null) {
            if (typeof item === 'object' && !(item instanceof File)) {
                if (item instanceof Array) {
                    item.forEach(f => formData.append(ele, f || ''))
                } else {
                    formData.append(ele, JSON.stringify(item))
                }
            } else {
                formData.append(ele, item)
            }
        }
    })

    return ryRequest.request<API.UploadPictureVo>('/api/v1/picture/upload', {
        method: 'POST',
        data: formData,
        ...(options || {})
    })
}

/** 批量上传图片(管理员) POST /api/v1/picture/upload/batch */
export async function pictureControllerUploadBatchV1(
    body: API.UploadBatchPictureDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.UploadBatchPictureVo>('/api/v1/picture/upload/batch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 上传图片(url) POST /api/v1/picture/upload/url */
export async function pictureControllerUploadFileByUrlV1(
    body: API.UploadPictureUrlDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.UploadPictureVo>('/api/v1/picture/upload/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
