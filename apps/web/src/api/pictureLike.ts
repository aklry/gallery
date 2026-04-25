// @ts-ignore
/* eslint-disable */
import ryRequest from '../services'

/** 点赞/取消点赞图片 POST /api/v1/picture-like/like */
export async function pictureLikeControllerLikePictureV1(
    body: API.CreatePictureLikeDto,
    options?: { [key: string]: any }
) {
    return ryRequest.request<API.PictureLikeVo>('/api/v1/picture-like/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body,
        ...(options || {})
    })
}
