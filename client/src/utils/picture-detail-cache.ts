import { pictureControllerGetByIdVoV1 } from '@/api/picture'
import { createExpiringRequestCache } from './picture-detail-cache-core'

export const PICTURE_DETAIL_CACHE_TTL = 5 * 60 * 1000

const requestPictureDetail = async (id: string) => {
    const res = await pictureControllerGetByIdVoV1({ id })
    if (res.code !== 1 || !res.data) {
        throw new Error(res.message || '获取图片详情失败')
    }
    return res.data
}

export const pictureDetailCache = createExpiringRequestCache<API.GetPictureVoModel>(requestPictureDetail, {
    ttl: PICTURE_DETAIL_CACHE_TTL
})
