<script setup lang="ts">
import { useSpaceDetail } from './hooks'
import { PlusOutlined } from '@ant-design/icons-vue'
import PictureCard from '@/components/picture-card/index.vue'

const {
    spaceDetail,
    handleCreateImage,
    privatePictureList,
    loading,
    handleDeletePrivatePicture,
    handleEditPrivatePicture,
    percent
} = useSpaceDetail()
</script>
<template>
    <div class="space-detail">
        <div class="space-detail-header p-4">
            <div class="flex flex-col gap-4">
                <h2 class="text-2xl font-bold">{{ spaceDetail?.spaceName }}</h2>
            </div>
            <a-space>
                <a-button type="primary" @click="handleCreateImage">
                    <div class="flex items-center">
                        创建图片
                        <PlusOutlined />
                    </div>
                </a-button>
                <a-tooltip title="当前使用空间容量">
                    <a-progress :percent="percent" type="circle" :size="42" />
                </a-tooltip>
            </a-space>
        </div>
        <picture-card
            :picture="privatePictureList"
            :loading="loading"
            @deletePicture="handleDeletePrivatePicture"
            @editPicture="handleEditPrivatePicture"
        />
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
