<script setup lang="ts">
import { ReviewStatus } from '@/constants'
import usePictureHooks from './hooks'
import { formatTime, formatSize } from '@/utils'
const {
    columns,
    dataSource,
    searchParams,
    handleChange,
    total,
    handleSearch,
    handleEdit,
    handleDelete,
    handleReview,
    openMessageModal,
    messageContent,
    handleMessageOk
} = usePictureHooks()
</script>

<template>
    <a-card class="picture-admin" title="图片管理" :bordered="false">
        <a-form :model="searchParams" layout="inline" class="mb-[10px]">
            <a-form-item label="关键词" name="searchText">
                <a-input v-model:value="searchParams.searchText" placeholder="请输入关键词" />
            </a-form-item>
            <a-form-item label="类型" name="category">
                <a-input v-model:value="searchParams.category" placeholder="请输入类型" />
            </a-form-item>
            <a-form-item label="标签" name="tags">
                <a-select
                    v-model:value="searchParams.tags"
                    mode="tags"
                    allowClear
                    class="min-w-[180px]"
                    placeholder="请输入标签"
                />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSearch">搜索</a-button>
            </a-form-item>
        </a-form>
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :pagination="{
                current: Number(searchParams.current),
                pageSize: Number(searchParams.pageSize),
                total
            }"
            :scroll="{ x: 'max-content', y: 300 }"
            @change="handleChange"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'url'">
                    <a-image :src="record.url" width="100px" height="100px" style="object-fit: cover" />
                </template>
                <template v-if="column.key === 'tags'">
                    <a-tag v-for="item in record.tags" color="success" :key="item">{{ item }}</a-tag>
                </template>
                <template v-if="column.key === 'createTime'">
                    {{ formatTime(record.createTime) }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-space>
                        <a-button size="small" type="primary" @click="handleEdit(record.id)">编辑</a-button>
                        <a-button size="small" type="primary" danger @click="handleDelete(record.id)">删除</a-button>
                        <a-button
                            size="small"
                            type="primary"
                            v-if="
                                record.reviewStatus === ReviewStatus.REVIEWING ||
                                record.reviewStatus === ReviewStatus.REJECT
                            "
                            @click="handleReview(record.id, ReviewStatus.PASS)"
                            >通过</a-button
                        >
                        <a-button
                            size="small"
                            type="primary"
                            danger
                            v-if="
                                record.reviewStatus === ReviewStatus.REVIEWING ||
                                record.reviewStatus === ReviewStatus.PASS
                            "
                            @click="handleReview(record.id, ReviewStatus.REJECT)"
                            >拒绝</a-button
                        >
                    </a-space>
                </template>
            </template>
            <template #pictureInfo="{ record }">
                <div>格式：{{ record.picFormat }}</div>
                <div>宽度: {{ record.picWidth }}</div>
                <div>高度: {{ record.picHeight }}</div>
                <div>宽高比: {{ record.picScale }}</div>
                <div>大小: {{ formatSize(record.picSize) }}</div>
            </template>
        </a-table>
        <a-modal v-model:open="openMessageModal" title="审核消息" okText="确认" cancelText="取消" @ok="handleMessageOk">
            <a-textarea v-model:value="messageContent" placeholder="请输入您的理由" />
        </a-modal>
    </a-card>
</template>

<style scoped></style>
