// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

type RecordPictureDownloadDto = {
    pictureId: string
}

type PictureDownloadVo = {
    code?: number
    message?: string
    data?: boolean
}

/** 记录图片下载 POST /api/v1/picture-download/record */
export async function pictureDownloadControllerRecordPictureDownloadV1(
    body: RecordPictureDownloadDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<PictureDownloadVo>('/api/v1/picture-download/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
