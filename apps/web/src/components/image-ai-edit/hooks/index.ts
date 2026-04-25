import { ref, toRefs } from 'vue'
import { ImageAiEditProps } from '../types'
import { pictureControllerAiEditPictureV1 } from '@/api/picture'
import { message } from 'ant-design-vue'

export const useImageAiEdit = (props: ImageAiEditProps) => {
    const { picture } = toRefs(props)
    const resultImages = ref<string[]>([])
    const selectedImageUrl = ref('')
    const loading = ref(false)
    const applyLoading = ref(false)
    const prompt = ref('')

    const handleGenerate = async () => {
        if (!prompt.value) {
            message.warning('请输入编辑描述')
            return
        }
        if (!picture?.value?.url) {
            message.error('未找到原图')
            return
        }

        loading.value = true
        try {
            const res = await pictureControllerAiEditPictureV1({
                prompt: prompt.value,
                url: picture.value.url
            })
            if (res.code === 1 && res.data) {
                resultImages.value = res.data
                if (res.data.length > 0) {
                    selectedImageUrl.value = res.data[0]
                }
                message.success('AI 编辑完成')
            } else {
                message.error(res.message || '生成失败')
            }
        } catch (error) {
            message.error('生成失败，请稍后重试')
        } finally {
            loading.value = false
        }
    }

    const handleApply = () => {
        if (!selectedImageUrl.value) {
            message.warning('请先选择一张生成的图片')
            return
        }
        applyLoading.value = true
        props.onSuccess?.(selectedImageUrl.value)
    }

    const setApplyLoading = (val: boolean) => {
        applyLoading.value = val
    }

    return {
        prompt,
        resultImages,
        selectedImageUrl,
        loading,
        applyLoading,
        handleGenerate,
        handleApply,
        setApplyLoading
    }
}
