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
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { PictureUploadProps } from './types'
import usePictureUpload from './hooks'

const props = defineProps<PictureUploadProps>()
const { loading, fileList, uploadCustomRequest, handleBeforeUpload } = usePictureUpload(props)
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
