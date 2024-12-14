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
const fileList = ref<any>([])
const props = defineProps<{
    onUploadSuccess: (result: API.UploadPictureVoModel) => void
    picture?: API.UploadPictureVoModel
}>()
const uploadCustomRequest = async () => {
    loading.value = true
    try {
        const params = props.picture ? { id: props.picture.id } : {}
        const res = await pictureControllerUploadFileV1(params, fileList.value[0].originFileObj)
        if (res.code === 1) {
            props.onUploadSuccess(res.data)
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
