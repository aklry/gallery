<script setup lang="ts">
import useSpaceHooks from './hooks'
import { formatTime, formatSize } from '@/utils'
import { SpaceLevelMap } from '@/constants'
import EditDialog from './components/edit-dialog.vue'
import QueryForm from './components/query-form.vue'
const {
    spaceList,
    total,
    columns,
    searchParams,
    handleEdit,
    handleDelete,
    openEditDialog,
    editRecord,
    handleEditConfirm,
    handleQuery,
    handleAnalyzePublic,
    handleAnalyzeAll
} = useSpaceHooks()
</script>
<template>
    <div class="space-admin">
        <a-card title="空间管理">
            <query-form :searchParams="searchParams" :query="handleQuery" />
            <template #extra>
                <a-space>
                    <a-button type="primary" @click="handleAnalyzePublic">分析公共图库</a-button>
                    <a-button type="primary" ghost danger @click="handleAnalyzeAll">分析全空间</a-button>
                </a-space>
            </template>
            <a-table
                :columns="columns"
                :data-source="spaceList"
                :pagination="{ total, current: Number(searchParams.current), pageSize: Number(searchParams.pageSize) }"
            >
                <template #bodyCell="{ column, record }: { column: any; record: API.SpaceModelVo }">
                    <template v-if="column.key === 'createTime'">
                        {{ formatTime(record.createTime) }}
                    </template>
                    <template v-if="column.key === 'updateTime'">
                        {{ formatTime(record.updateTime) }}
                    </template>
                    <template v-if="column.key === 'createUser'">
                        {{ record.user.userName || '佚名' }}
                    </template>
                    <template v-if="column.key === 'spaceLevel'">
                        <a-tag :color="SpaceLevelMap[record.spaceLevel as keyof typeof SpaceLevelMap].color">
                            {{ SpaceLevelMap[record.spaceLevel as keyof typeof SpaceLevelMap].text }}
                        </a-tag>
                    </template>
                    <template v-if="column.key === 'case'">
                        <p>数量: {{ record.totalCount }}/{{ record.maxCount }}</p>
                        <p>大小: {{ formatSize(record.totalSize) }}/{{ formatSize(record.maxSize) }}</p>
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
                            <a-button type="primary" danger @click="handleDelete(record)">删除</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
            <EditDialog v-model:open="openEditDialog" :edit-record="editRecord" :confirm="handleEditConfirm" />
        </a-card>
    </div>
</template>
<style scoped lang="scss">
.index-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
