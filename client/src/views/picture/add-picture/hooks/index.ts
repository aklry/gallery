import { ref, reactive, onMounted } from 'vue'
import {
    pictureControllerUpdatePictureV1,
    pictureControllerGetByIdV1,
    pictureControllerEditPictureV1,
    pictureControllerUploadFileByUrlV1
} from '@/api/picture'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import usePictureStore from '@/store/modules/picture'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { UserRole } from '@/constants'
const useAddPicture = () => {
    const pictureStore = usePictureStore()
    const { tag_category } = storeToRefs(pictureStore)
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const route = useRoute()
    const router = useRouter()
    const id = route.query?.id
    const picture = ref<API.UploadPictureVoModel>()
    const url = ref<string>('')
    const handleUploadSuccess = (result: API.UploadPictureVoModel) => {
        picture.value = result
        pictureInfo.name = result.filename
        pictureInfo.id = result.id
    }
    const loading = ref<boolean>(false)
    const uploadLoading = ref<boolean>(false)
    const pictureInfo = reactive<API.UpdatePictureDto>({
        id: '',
        introduction: '',
        name: '',
        category: '',
        tags: []
    })
    const handleUpdatePicture = async () => {
        try {
            loading.value = true
            let res: API.UpdatePictureVo
            if (loginUser.value?.userRole === UserRole.ADMIN) {
                res = await pictureControllerUpdatePictureV1(pictureInfo)
            } else {
                res = await pictureControllerEditPictureV1(pictureInfo)
            }
            if (res.data) {
                message.success('创建成功')
                router.push(`/picture/${pictureInfo.id}`)
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('创建失败')
        } finally {
            loading.value = false
        }
    }

    const handleUploadPictureByUrl = async () => {
        uploadLoading.value = true
        if (!url.value) {
            message.error('请输入图片链接')
            return
        }
        try {
            const res = await pictureControllerUploadFileByUrlV1({ url: url.value })
            if (res.code === 1) {
                message.success('上传成功')
                pictureInfo.name = res.data.filename
                pictureInfo.id = res.data.id
                picture.value = {
                    id: res.data.id,
                    url: res.data.url,
                    filename: res.data.filename,
                    picScale: res.data.picScale,
                    width: res.data.width,
                    height: res.data.height,
                    fileSize: res.data.fileSize,
                    format: res.data.format
                }
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('上传失败')
        } finally {
            uploadLoading.value = false
        }
    }

    onMounted(async () => {
        if (id) {
            try {
                const res = await pictureControllerGetByIdV1({ id: id as string })
                if (res.code === 1) {
                    Object.assign(pictureInfo, {
                        id: res.data.id,
                        name: res.data.name,
                        introduction: res.data.introduction,
                        category: res.data.category,
                        tags: res.data.tags
                    })
                    picture.value = {
                        id: res.data.id,
                        url: res.data.url,
                        filename: res.data.name,
                        picScale: res.data.picScale,
                        width: res.data.picWidth,
                        height: res.data.picHeight,
                        fileSize: res.data.picSize,
                        format: res.data.picFormat
                    }
                }
            } catch (error) {
                message.error('获取数据失败,请重试')
            }
        }
    })
    return {
        pictureInfo,
        picture,
        url,
        handleUploadSuccess,
        handleUpdatePicture,
        loading,
        tag_category,
        id,
        uploadLoading,
        handleUploadPictureByUrl
    }
}

export default useAddPicture
