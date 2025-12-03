<script setup lang="ts">
import PictureUpload from '@/components/picture-upload/index.vue'
import useAddPicture from './hooks'
import ImageCropper from '@/components/image-cropper/index.vue'
import ImageExpand from '@/components/image-expand/index.vue'

const {
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
    handleUploadPictureByUrl,
    openCropperModal,
    handleCropSuccess,
    handleExpandSuccess,
    openExpandModal,
    text,
    handleGenerateImageTaskByAi,
    generateLoading
} = useAddPicture()
</script>
<template>
    <div class="add-picture">
        <div class="add-picture__header">
            <h2 class="add-picture__title">{{ id ? '修改图片' : '创建图片' }}</h2>
            <p class="add-picture__subtitle">支持本地上传或 URL 导入，完善信息后可继续编辑与扩图。</p>
        </div>
        <div class="add-picture__panels">
            <a-card class="add-picture__panel" :bordered="false">
                <template #title>
                    <div class="add-picture__panel-header">
                        <span>上传方式</span>
                        <span class="add-picture__panel-tip">先上传图片即可开启后续编辑能力</span>
                    </div>
                </template>
                <a-tabs class="add-picture__tabs">
                    <a-tab-pane key="1" tab="文件上传">
                        <picture-upload
                            :picture="picture"
                            :spaceId="spaceId"
                            :onUploadPictureSuccess="handleUploadSuccess"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="URL上传">
                        <div class="add-picture__url-upload">
                            <a-input v-model:value="url" placeholder="请输入图片链接" />
                            <a-button :loading="uploadLoading" type="primary" @click="handleUploadPictureByUrl"
                                >上传</a-button
                            >
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="文生图(AI)">
                        <div class="add-picture__url-upload">
                            <a-textarea v-model:value="text" placeholder="请输入文字用于ai生图" />
                            <template v-if="url">
                                <a-button :loading="uploadLoading" type="primary" @click="handleUploadPictureByUrl"
                                    >上传</a-button
                                >
                            </template>
                            <template v-else>
                                <a-button
                                    :loading="generateLoading"
                                    type="primary"
                                    @click="handleGenerateImageTaskByAi"
                                >
                                    {{ generateLoading ? '生成中...' : '生成' }}
                                </a-button>
                            </template>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </a-card>
            <a-card
                class="add-picture__panel add-picture__panel--info"
                title="图片信息"
                v-if="picture"
                :bordered="false"
            >
                <a-form class="add-picture__form" :model="pictureInfo" layout="vertical">
                    <a-form-item label="图片名称" name="name">
                        <a-input v-model:value="pictureInfo.name" />
                    </a-form-item>
                    <a-form-item label="图片简介" name="introduction">
                        <a-input v-model:value="pictureInfo.introduction" />
                    </a-form-item>
                    <a-form-item label="图片分类" name="category">
                        <a-auto-complete
                            v-model:value="pictureInfo.category"
                            allowClear
                            placeholder="请输入分类"
                            :options="tag_category?.categoryList"
                        />
                    </a-form-item>
                    <a-form-item label="图片标签" name="tags">
                        <a-select v-model:value="pictureInfo.tags" :options="tag_category?.tagList" mode="tags" />
                    </a-form-item>
                    <a-form-item class="add-picture__actions">
                        <a-button :loading="loading" type="primary" @click="handleUpdatePicture" class="mr-2">
                            创建
                        </a-button>
                        <a-button @click="openCropperModal = true" class="mr-2">编辑</a-button>
                        <a-button @click="openExpandModal = true">扩图</a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </div>
        <div v-if="url" class="add-picture__ai-image-preview">
            <a-image :src="url" width="250px" alt="AI生成图片预览" />
        </div>
        <image-cropper
            v-model:visible="openCropperModal"
            :imageUrl="picture?.url || ''"
            :picture="picture"
            :spaceId="spaceId"
            :onSuccess="handleCropSuccess"
        />
        <image-expand
            ref="imageExpandRef"
            v-model:visible="openExpandModal"
            :picture="picture"
            :onSuccess="handleExpandSuccess"
        />
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
