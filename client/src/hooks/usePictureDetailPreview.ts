import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { pictureDetailCache } from '@/utils/picture-detail-cache'

export const usePictureDetailPreview = () => {
    const detailVisible = ref(false)
    const detailPicture = ref<API.GetPictureVoModel | null>(null)
    const detailLoading = ref(false)

    const openPictureDetail = async (id: string) => {
        const cachedPicture = pictureDetailCache.peek(id)
        detailPicture.value = cachedPicture ?? null
        detailVisible.value = true
        detailLoading.value = !cachedPicture

        try {
            detailPicture.value = await pictureDetailCache.get(id)
        } catch (error) {
            if (!cachedPicture) {
                detailPicture.value = null
            }
            message.error(error instanceof Error ? error.message : '获取图片详情失败')
        } finally {
            detailLoading.value = false
        }
    }

    return {
        detailVisible,
        detailPicture,
        detailLoading,
        openPictureDetail
    }
}
