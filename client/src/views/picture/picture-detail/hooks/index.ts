import { message, Modal } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { pictureControllerGetByIdVoV1, pictureControllerDeletePictureV1 } from '@/api/picture'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { downloadPicture as download } from '@/utils'
const usePictureDetail = (id: string) => {
    const picture = ref<API.GetPictureVoModel>()
    const router = useRouter()
    const userStore = useUserStore()
    const canEditOrDelete = computed(() => {
        const user = userStore.loginUser
        if (!user || !user.id) return false
        const pictureUser = picture.value?.user
        return user.id === pictureUser?.id || user.userRole === 'admin'
    })
    const getPictureDetail = async () => {
        try {
            const res = await pictureControllerGetByIdVoV1({ id })
            picture.value = res.data
        } catch (error) {
            message.error('获取图片详情失败')
        }
    }
    const deletePicture = async () => {
        Modal.confirm({
            title: '确定要删除这张图片吗？',
            content: '删除后将无法恢复',
            okText: '删除',
            cancelText: '取消',
            onOk: async () => {
                try {
                    if (!canEditOrDelete.value) {
                        message.error('您没有权限删除这张图片')
                        return
                    }
                    await pictureControllerDeletePictureV1({ id })
                    message.success('删除图片成功')
                    setTimeout(() => {
                        router.push('/picture')
                    }, 1000)
                } catch (error) {
                    message.error('删除图片失败')
                }
            }
        })
    }
    const editPicture = () => {
        if (!canEditOrDelete.value) {
            message.error('您没有权限编辑这张图片')
            return
        }
        router.push(`/picture/add?id=${id}`)
    }
    const downloadPicture = (url?: string, filename?: string) => {
        download(url, filename)
    }
    onMounted(() => {
        getPictureDetail()
    })
    return {
        picture,
        deletePicture,
        canEditOrDelete,
        editPicture,
        downloadPicture
    }
}

export default usePictureDetail
