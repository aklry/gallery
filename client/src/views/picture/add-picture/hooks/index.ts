import { ref, reactive, onMounted, useTemplateRef } from 'vue'
import {
    pictureControllerUpdatePictureV1,
    pictureControllerEditPictureV1,
    pictureControllerUploadFileByUrlV1,
    pictureControllerGetByIdVoV1
} from '@/api/picture'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import usePictureStore from '@/store/modules/picture'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { UserRole } from '@/constants'
import ImageExpand from '@/components/image-expand/index.vue'
import { useGenerateImageByAi } from './useGenerateImage'
import { pictureDetailCache } from '@/utils/picture-detail-cache'

const useAddPicture = () => {
    const pictureStore = usePictureStore()
    const { tag_category } = storeToRefs(pictureStore)
    const imageExpand = useTemplateRef<InstanceType<typeof ImageExpand>>('imageExpandRef')
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const route = useRoute()
    const router = useRouter()
    const id = route.query?.id as string
    const spaceId = route.query?.spaceId as string
    const picture = ref<API.UploadPictureVoModel>()
    const url = ref<string>('')
    const setUrl = (newUrl: string) => {
        url.value = newUrl
    }
    const { handleGenerateImageTaskByAi, text, loading: generateLoading } = useGenerateImageByAi(setUrl)
    const openCropperModal = ref(false)
    const openExpandModal = ref(false)
    // 把后端 AI 生成的新标签合并进表单和全局 store
    const mergeTags = (tags?: string[]) => {
        if (!tags || tags.length === 0) return
        pictureInfo.tags = [...tags] // 填入表单
        // 动态推入 Store 的静态下拉配置里，避免由于配置不存在导致无法显示下拉高亮
        const existingTags = new Set(tag_category.value.tagList.map((item: any) => item.value))
        tags.forEach(tag => {
            if (!existingTags.has(tag)) {
                tag_category.value.tagList.push({ value: tag } as any)
            }
        })
    }
    const handleUploadSuccess = (result: API.UploadPictureVoModel | any) => {
        picture.value = result
        pictureInfo.name = result.filename
        pictureInfo.id = result.id
        mergeTags(result.tags)
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
                const targetId = (id || pictureInfo.id) as string | undefined
                if (targetId) {
                    pictureDetailCache.invalidate(targetId)
                }
                message.success(`${id ? '修改成功' : '创建成功'}`)
                router.replace('/')
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
            uploadLoading.value = false
            return
        }
        try {
            const res = await pictureControllerUploadFileByUrlV1({ url: url.value, spaceId, id })
            if (res.code === 1) {
                message.success('上传成功')
                pictureInfo.name = res.data.filename
                pictureInfo.id = res.data.id
                pictureInfo.url = res.data.url
                pictureInfo.thumbnailUrl = res.data.thumbnailUrl
                if ((res.data as any).tags) {
                    mergeTags((res.data as any).tags)
                }
                picture.value = {
                    id: res.data.id,
                    url: res.data.url,
                    filename: res.data.filename,
                    picScale: res.data.picScale,
                    width: res.data.width,
                    height: res.data.height,
                    fileSize: res.data.fileSize,
                    format: res.data.format,
                    thumbnailUrl: res.data.thumbnailUrl,
                    color: res.data.color
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

    const handleCropSuccess = (cropPicture: API.UploadPictureVoModel | any) => {
        pictureInfo.name = cropPicture.filename
        pictureInfo.id = cropPicture.id
        mergeTags(cropPicture.tags)
        picture.value = {
            id: cropPicture.id,
            url: cropPicture.url,
            filename: cropPicture.filename,
            picScale: cropPicture.picScale,
            width: cropPicture.width,
            height: cropPicture.height,
            fileSize: cropPicture.fileSize,
            format: cropPicture.format,
            thumbnailUrl: cropPicture.thumbnailUrl,
            color: cropPicture.color
        }
        openCropperModal.value = false
        imageExpand.value?.setApplyLoading(false)
    }
    const handleExpandSuccess = async (expandPictureUrl: string) => {
        url.value = expandPictureUrl
        await handleUploadPictureByUrl()
        openExpandModal.value = false
    }

    onMounted(async () => {
        if (id) {
            try {
                const res = await pictureControllerGetByIdVoV1({ id })
                if (res.code === 1) {
                    Object.assign(pictureInfo, {
                        id: res.data.id,
                        name: res.data.name,
                        introduction: res.data.introduction,
                        category: res.data.category,
                        tags: res.data.tags,
                        spaceId: res.data.spaceId
                    })
                    picture.value = {
                        id: res.data.id,
                        url: res.data.url,
                        filename: res.data.name,
                        picScale: res.data.picScale,
                        width: res.data.picWidth,
                        height: res.data.picHeight,
                        fileSize: res.data.picSize,
                        format: res.data.picFormat,
                        thumbnailUrl: res.data.thumbnailUrl,
                        color: res.data.picColor
                    }
                }
            } catch (error) {
                message.error('获取数据失败，请重试')
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
        spaceId,
        uploadLoading,
        openCropperModal,
        handleUploadPictureByUrl,
        handleCropSuccess,
        handleExpandSuccess,
        handleGenerateImageTaskByAi,
        openExpandModal,
        text,
        generateLoading
    }
}

export default useAddPicture
