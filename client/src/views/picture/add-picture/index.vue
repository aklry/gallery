<template>
    <div class="add-picture">
        <h2 class="text-xl">{{ id ? '修改图片' : '创建图片' }}</h2>
        <a-tabs>
            <a-tab-pane key="1" tab="文件上传">
                <picture-upload :picture="picture" :onUploadPictureSuccess="handleUploadSuccess" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="URL上传">
                <a-input v-model:value="url" placeholder="请输入图片链接" />
                <a-button class="mt-2" :loading="uploadLoading" @click="handleUploadPictureByUrl">上传</a-button>
            </a-tab-pane>
        </a-tabs>
        <a-card title="图片信息" v-if="picture">
            <a-form :model="pictureInfo">
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
                <a-form-item>
                    <a-button :loading="loading" type="primary" block @click="handleUpdatePicture">创建</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/picture-upload/index.vue'
import useAddPicture from './hooks'

const {
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
} = useAddPicture()
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
