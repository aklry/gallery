// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 记录图片下载 POST /api/v1/picture-download/record */
export async function pictureDownloadControllerRecordPictureDownloadV1(
    body: API.CreatePictureDownloadDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.PictureDownloadVo>('/api/v1/picture-download/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
