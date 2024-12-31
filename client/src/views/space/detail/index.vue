<script setup lang="ts">
import { useSpaceDetail } from './hooks'
import { PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import PictureCard from '@/components/picture-card/index.vue'
import QueryForm from './component/query-form/index.vue'
import EditBatchModal from './component/edit-batch-modal/index.vue'

const {
    spaceDetail,
    handleCreateImage,
    privatePictureList,
    loading,
    handleDeletePrivatePicture,
    handleEditPrivatePicture,
    percent,
    spaceId,
    editBatchModalVisible,
    handleSearch,
    handleReset,
    handleEditBatchPicture
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
                <a-button type="primary" @click="editBatchModalVisible = true">
                    <div class="flex items-center">
                        批量编辑
                        <EditOutlined class="ml-1" />
                    </div>
                </a-button>
                <a-tooltip title="当前使用空间容量">
                    <a-progress :percent="percent" type="circle" :size="42" />
                </a-tooltip>
            </a-space>
        </div>
        <query-form :onSuccess="handleSearch" :spaceId="spaceId as string" :onReset="handleReset" />
        <picture-card
            :picture="privatePictureList"
            :loading="loading"
            @deletePicture="handleDeletePrivatePicture"
            @editPicture="handleEditPrivatePicture"
        />
        <edit-batch-modal
            v-model:visible="editBatchModalVisible"
            :pictureList="privatePictureList"
            :on-ok="handleEditBatchPicture"
        />
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
