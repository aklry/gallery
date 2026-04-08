<script setup lang="ts">
import { useSpaceDetail } from './hooks'
import { PlusOutlined, EditOutlined, BarChartOutlined, PictureOutlined, CloudOutlined } from '@ant-design/icons-vue'
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
    handleEditBatchPicture,
    handleGoToSpaceAnalyze,
    handlePreviewPrivatePicture,
    pictureCount
} = useSpaceDetail()
</script>
<template>
    <div class="space-detail">
        <!-- Header -->
        <div class="space-detail-header">
            <div class="space-info">
                <h2 class="space-info__name">{{ spaceDetail?.spaceName }}</h2>
                <div class="space-info__stats">
                    <div class="stat-item">
                        <PictureOutlined />
                        <span class="stat-value">{{ pictureCount }}</span>
                        张图片
                    </div>
                    <span class="stat-divider">|</span>
                    <div class="space-capacity">
                        <CloudOutlined style="color: #64748b" />
                        <a-tooltip title="当前使用空间容量">
                            <a-progress
                                :percent="percent"
                                :size="[120, 8]"
                                :stroke-color="{ from: '#6366f1', to: '#8b5cf6' }"
                            />
                        </a-tooltip>
                        <span class="space-capacity__label">{{ percent }}%</span>
                    </div>
                </div>
            </div>
            <div class="space-actions">
                <a-button type="primary" @click="handleCreateImage">
                    <PlusOutlined />
                    创建图片
                </a-button>
                <a-button type="primary" ghost @click="handleGoToSpaceAnalyze">
                    <BarChartOutlined />
                    空间分析
                </a-button>
                <a-button type="primary" ghost @click="editBatchModalVisible = true">
                    <EditOutlined />
                    批量编辑
                </a-button>
            </div>
        </div>

        <!-- Search & Filter -->
        <query-form :onSuccess="handleSearch" :spaceId="spaceId" :onReset="handleReset" />

        <!-- Picture Grid -->
        <template v-if="privatePictureList.length > 0 || loading">
            <picture-card
                :picture="privatePictureList"
                :loading="loading"
                @deletePicture="handleDeletePrivatePicture"
                @editPicture="handleEditPrivatePicture"
                @previewPicture="handlePreviewPrivatePicture"
            />
        </template>
        <template v-else>
            <div class="empty-state">
                <a-empty description="暂无图片，点击「创建图片」开始上传吧">
                    <a-button type="primary" @click="handleCreateImage">
                        <PlusOutlined />
                        创建图片
                    </a-button>
                </a-empty>
            </div>
        </template>

        <!-- Batch Edit Modal -->
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
