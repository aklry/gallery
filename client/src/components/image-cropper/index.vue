<script setup lang="ts">
import { ImageCropperProps } from './types'
import { useImageCropper } from './hooks'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const props = defineProps<ImageCropperProps>()
const visible = defineModel<boolean>('visible', {
    type: Boolean,
    default: false
})
const { handleRotateLeft, handleRotateRight, handleZoomOut, handleZoomIn, handleSaveCropPicture } =
    useImageCropper(props)
</script>
<template>
    <a-modal class="image-cropper" v-model:open="visible" :footer="false" style="height: 500px" :closable="false">
        <vue-cropper
            ref="cropper"
            :img="imageUrl"
            :autoCrop="true"
            :fixBox="false"
            :centerBox="true"
            :canMoveBox="true"
            :info="true"
            outputType="png"
        />
        <div class="mb-4" />
        <div class="flex justify-end gap-2">
            <a-button @click="handleRotateLeft">向左旋转</a-button>
            <a-button @click="handleRotateRight">向右旋转</a-button>
            <a-button @click="handleZoomOut">放大</a-button>
            <a-button @click="handleZoomIn">缩小</a-button>
            <a-button type="primary" @click="handleSaveCropPicture">保存</a-button>
        </div>
    </a-modal>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
