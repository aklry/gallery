// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 此处后端没有提供注释 GET /api/v1/picture */
export async function pictureControllerFindAllV1(options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1/picture', {
        method: 'GET',
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/picture */
export async function pictureControllerCreateV1(body: API.CreatePictureDto, options?: { [key: string]: any }) {
    return ryRequest.request<any>('/api/v1/picture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 GET /api/v1/picture/${param0} */
export async function pictureControllerFindOneV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureControllerFindOneV1Params,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<any>(`/api/v1/picture/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 DELETE /api/v1/picture/${param0} */
export async function pictureControllerRemoveV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureControllerRemoveV1Params,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<any>(`/api/v1/picture/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {})
    })
}

/** 此处后端没有提供注释 PATCH /api/v1/picture/${param0} */
export async function pictureControllerUpdateV1(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureControllerUpdateV1Params,
    body: API.UpdatePictureDto,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params
    return ryRequest.request<any>(`/api/v1/picture/${param0}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        params: { ...queryParams },
        data: body,
        ...(options || {})
    })
}

/** 此处后端没有提供注释 POST /api/v1/picture/upload */
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
