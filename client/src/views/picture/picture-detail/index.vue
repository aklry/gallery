<template>
    <div class="picture-detail">
        <a-row :gutter="[16, 16]">
            <a-col :sm="24" :md="12" ::xl="18">
                <a-card title="图片预览">
                    <a-image :src="picture?.url" :alt="picture?.name" style="max-height: 500px; object-fit: contain" />
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <a-card title="图片详情">
                    <a-descriptions :column="1">
                        <a-descriptions-item label="作者">
                            <a-space>
                                <a-avatar :size="24" :src="picture?.user.userAvatar" />
                                <span>{{ picture?.user.userName ?? '佚名' }}</span>
                            </a-space>
                        </a-descriptions-item>
                        <a-descriptions-item label="名称">{{ picture?.name }}</a-descriptions-item>
                        <a-descriptions-item label="描述">{{ picture?.introduction }}</a-descriptions-item>
                        <a-descriptions-item label="标签">
                            <a-tag v-for="tag in picture?.tags" :key="tag" color="success">{{ tag }}</a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="分类">{{ picture?.category }}</a-descriptions-item>
                        <a-descriptions-item label="格式">{{ picture?.picFormat }}</a-descriptions-item>
                        <a-descriptions-item label="宽度">{{ picture?.picWidth }}</a-descriptions-item>
                        <a-descriptions-item label="高度">{{ picture?.picHeight }}</a-descriptions-item>
                        <a-descriptions-item label="宽高比">{{ picture?.picScale }}</a-descriptions-item>
                        <a-descriptions-item label="大小">{{ formatSize(picture?.picSize) }}</a-descriptions-item>
                        <a-descriptions-item label="上传时间">{{
                            formatTime(picture?.createTime)
                        }}</a-descriptions-item>
                        <a-descriptions-item label="主色调">
                            <a-space>
                                {{ toHexColor(picture?.picColor) || '暂无主色调' }}
                                <div
                                    :style="{ backgroundColor: toHexColor(picture?.picColor) }"
                                    class="color-box"
                                    v-if="picture?.picColor"
                                />
                            </a-space>
                        </a-descriptions-item>
                        <a-descriptions-item label="操作">
                            <a-space>
                                <a-button size="small" v-if="canEditOrDelete" @click="editPicture">编辑</a-button>
                                <a-button
                                    danger
                                    type="primary"
                                    size="small"
                                    v-if="canEditOrDelete"
                                    @click="deletePicture"
                                    >删除</a-button
                                >
                                <a-button
                                    type="primary"
                                    size="small"
                                    @click="downloadPicture(picture?.url, picture?.name)"
                                    >下载</a-button
                                >
                            </a-space>
                        </a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import usePictureDetail from './hooks'
import { formatTime, formatSize, toHexColor } from '@/utils'

const props = defineProps<{
    id: string
}>()

const { picture, deletePicture, canEditOrDelete, editPicture, downloadPicture } = usePictureDetail(props.id)
</script>

<style scoped lang="scss">
@use './css/index.scss' as *;
</style>
