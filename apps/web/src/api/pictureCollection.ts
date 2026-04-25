// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 收藏/取消收藏图片 POST /api/v1/picture-collection/favorite */
export async function pictureCollectionControllerFavoritePictureCollectionV1(
    body: API.CreatePictureCollectionDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.PictureCollectionVo>('/api/v1/picture-collection/favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
