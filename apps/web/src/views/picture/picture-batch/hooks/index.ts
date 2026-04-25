import { reactive, ref } from 'vue'
import { pictureControllerUploadBatchV1 } from '@/api/picture'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const usePictureBatchHooks = () => {
    const formState = reactive<API.UploadBatchPictureDto>({
        keywords: '',
        count: 0
    })
    const loading = ref(false)
    const router = useRouter()
    const handleSubmit = async () => {
        try {
            loading.value = true
            const res = await pictureControllerUploadBatchV1(formState)
            if (res.code === 1) {
                message.success('批量添加成功,1s后跳转')
                setTimeout(() => {
                    router.push('/picture/admin')
                }, 1000)
            } else {
                message.error(res.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }
    return {
        formState,
        handleSubmit,
        loading
    }
}

export default usePictureBatchHooks
