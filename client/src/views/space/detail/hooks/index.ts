import { useRoute, useRouter } from 'vue-router'
import { spaceControllerListSpaceV1 } from '@/api/space'
import { pictureControllerDeletePictureV1, pictureControllerGetPictureByPageVoV1 } from '@/api/picture'
import { computed, onMounted, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'

export const useSpaceDetail = () => {
    const route = useRoute()
    const router = useRouter()
    const spaceId = route.params.id
    const spaceDetail = ref<API.SpaceModelVo>()
    const privatePictureList = ref<API.ShowPictureModelVo[]>([])
    const loading = ref(false)
    const percent = computed(() => {
        const percent = (((spaceDetail.value?.totalSize ?? 0) / (spaceDetail.value?.maxSize ?? 1)) * 100).toFixed(2)
        return parseFloat(percent)
    })
    const fetchSpaceDetail = async () => {
        const res = await spaceControllerListSpaceV1({
            id: spaceId as string,
            current: '1',
            pageSize: '1'
        })
        if (res.code === 1) {
            spaceDetail.value = res.data.list[0]
        } else {
            message.error(res.message)
        }
    }
    const fetchPrivatePicture = async () => {
        try {
            const res = await pictureControllerGetPictureByPageVoV1({
                spaceId: spaceId as string,
                current: '1',
                pageSize: '10'
            })
            if (res.code === 1) {
                privatePictureList.value = res.data.list
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取图片失败')
        }
    }
    const handleCreateImage = () => {
        router.push(`/picture/add?spaceId=${spaceId}`)
    }

    const handleDeletePrivatePicture = async (id: string) => {
        Modal.confirm({
            title: '确定删除图片吗？',
            content: '删除后将无法恢复',
            okText: '删除',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await pictureControllerDeletePictureV1({
                        id
                    })
                    if (res.code === 1) {
                        message.success('删除成功')
                        fetchPrivatePicture()
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('删除图片失败')
                }
            }
        })
    }

    const handleEditPrivatePicture = (id: string) => {
        router.push(`/picture/add?id=${id}&spaceId=${spaceId}`)
    }

    onMounted(() => {
        fetchSpaceDetail()
        fetchPrivatePicture()
    })

    return {
        spaceDetail,
        handleCreateImage,
        privatePictureList,
        loading,
        percent,
        handleDeletePrivatePicture,
        handleEditPrivatePicture
    }
}
