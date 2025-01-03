<template>
    <div class="picture-upload">
        <a-upload
            :customRequest="uploadCustomRequest"
            v-model:fileList="fileList"
            list-type="picture-card"
            :showUploadList="false"
            :beforeUpload="handleBeforeUpload"
            :maxCount="1"
        >
            <img v-if="picture?.url" :src="picture.url" alt="avatar" />
            <div v-else>
                <loading-outlined v-if="loading" />
                <plus-outlined class="text-3xl" v-else />
                <div class="ant-upload-text">拖拽或点击上传图片</div>
            </div>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message, UploadProps } from 'ant-design-vue'
import { pictureControllerUploadFileV1 } from '@/api/picture'
import { userControllerUploadUserAvatarV1 } from '@/api/user'
const fileList = ref<any>([])
const props = defineProps<{
    onUploadPictureSuccess?: (result: API.UploadPictureVoModel) => void
    onUploadAvatarSuccess?: (result: API.UploadAvatarVoModel) => void
    picture?: API.UploadPictureVoModel | API.UploadAvatarVoModel
    prefix?: string
    spaceId?: string
}>()
const uploadCustomRequest = async () => {
    loading.value = true
    try {
        let res: API.UploadAvatarVo | API.UploadPictureVo
        let params: any = {}
        if (props.picture && 'id' in props.picture) {
            params.id = props.picture.id
        }
        if (props.spaceId) {
            params.spaceId = props.spaceId
        }
        if (props.prefix) {
            res = await userControllerUploadUserAvatarV1({ prefix: props.prefix }, fileList.value[0].originFileObj)
        } else {
            res = await pictureControllerUploadFileV1(params, fileList.value[0].originFileObj)
        }
        if (res.code === 1) {
            if (props.prefix) {
                props?.onUploadAvatarSuccess?.(res.data)
            } else {
                props?.onUploadPictureSuccess?.(res.data as API.UploadPictureVoModel)
            }
        } else {
            message.error(res.message)
        }
    } catch (error) {
        message.error('上传失败')
    } finally {
        loading.value = false
    }
}
// @ts-ignore
const handleBeforeUpload = (file: UploadProps['fileList'][number]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('格式不对')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('图片不能大于2M')
    }
    return isJpgOrPng && isLt2M
}
const loading = ref<boolean>(false)
</script>

<style scoped lang="scss">
.picture-upload {
    user-select: none;
    @apply w-full;

    :deep(.ant-upload) {
        @apply w-full min-h-[250px] flex items-center justify-center !important;
    }

    .ant-upload-select-picture-card i {
        @apply text-[16px] text-gray-500;
    }

    img {
        @apply max-w-full max-h-[250px] object-cover;
    }

    .ant-upload-text {
        @apply text-xl text-gray-700 mt-2;
    }
}
</style>
