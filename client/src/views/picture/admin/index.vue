<script setup lang="ts">
import { ReviewStatus } from '@/constants'
import usePictureHooks from './hooks'
import { formatTime, formatSize } from '@/utils'
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PictureOutlined,
    ClockCircleOutlined
} from '@ant-design/icons-vue'

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
    handleMessageOk,
    goToBatchAddPicture,
    selectedRowKeys,
    rowSelection,
    handleBatchDelete
} = usePictureHooks()

const reviewStatusConfig: Record<number, { color: string; text: string }> = {
    [ReviewStatus.REVIEWING]: { color: 'processing', text: '待审核' },
    [ReviewStatus.PASS]: { color: 'success', text: '已通过' },
    [ReviewStatus.REJECT]: { color: 'error', text: '已拒绝' }
}
</script>

<template>
    <div class="min-h-full min-w-0 bg-[#f5f7fa] p-6">
        <!-- 页面头部 -->
        <div
            class="mb-5 flex items-center justify-between rounded-xl border border-[#f0f0f0] bg-white px-6 py-5 shadow-sm"
        >
            <div class="flex items-center gap-3.5">
                <PictureOutlined class="text-[32px] text-[#1677ff]" />
                <div>
                    <h2 class="m-0 text-xl font-bold leading-tight text-[#262626]">图片管理</h2>
                    <p class="mt-1 text-[13px] text-[#8c8c8c]">共 {{ total }} 张图片</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <a-button
                    v-if="selectedRowKeys.length > 0"
                    danger
                    type="primary"
                    size="large"
                    class="!rounded-lg !font-medium"
                    @click="handleBatchDelete"
                >
                    <span style="display: inline-flex; align-items: center; gap: 6px">
                        <DeleteOutlined />
                        批量删除 ({{ selectedRowKeys.length }})
                    </span>
                </a-button>
                <a-button
                    type="primary"
                    size="large"
                    class="add-btn !rounded-lg !font-medium"
                    @click="goToBatchAddPicture"
                >
                    <span style="display: inline-flex; align-items: center; gap: 6px">
                        <PlusOutlined />
                        批量上传
                    </span>
                </a-button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="mb-5 rounded-xl border border-[#f0f0f0] bg-white px-6 py-5 shadow-sm">
            <a-form :model="searchParams" layout="inline" class="flex flex-wrap items-end gap-1">
                <a-form-item label="关键词" name="searchText">
                    <a-input
                        v-model:value="searchParams.searchText"
                        placeholder="请输入关键词"
                        allow-clear
                        class="!w-[200px]"
                    >
                        <template #prefix><SearchOutlined class="text-[#bfbfbf]" /></template>
                    </a-input>
                </a-form-item>
                <a-form-item label="类型" name="category">
                    <a-input
                        v-model:value="searchParams.category"
                        placeholder="请输入类型"
                        allow-clear
                        class="!w-[200px]"
                    />
                </a-form-item>
                <a-form-item label="标签" name="tags">
                    <a-select
                        v-model:value="searchParams.tags"
                        mode="tags"
                        allowClear
                        class="min-w-[200px]"
                        placeholder="请输入标签"
                    />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" class="!rounded-md !font-medium" @click="handleSearch">
                        <template #icon><SearchOutlined /></template>
                        搜索
                    </a-button>
                </a-form-item>
            </a-form>
        </div>

        <!-- 数据表格 -->
        <div class="min-w-0 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white px-6 py-5 shadow-sm">
            <a-table
                :row-selection="rowSelection"
                rowKey="id"
                :dataSource="dataSource"
                :columns="columns"
                :pagination="{
                    current: Number(searchParams.current),
                    pageSize: Number(searchParams.pageSize),
                    total,
                    showSizeChanger: true,
                    showTotal: (t: number) => `共 ${t} 条记录`
                }"
                :scroll="{ x: 'max-content', y: 'calc(100vh - 560px)' }"
                row-class-name="table-row"
                @change="handleChange"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'url'">
                        <div class="h-20 w-20 overflow-hidden rounded-lg border border-[#f0f0f0] bg-[#fafafa]">
                            <a-image :src="record.url" width="80" height="80" class="thumb-img" />
                        </div>
                    </template>
                    <template v-if="column.key === 'tags'">
                        <div class="flex max-w-[180px] flex-wrap gap-1">
                            <a-tag v-for="item in record.tags" :key="item" color="blue" class="!rounded !text-xs">{{
                                item
                            }}</a-tag>
                            <span v-if="!record.tags?.length" class="text-[13px] text-[#bfbfbf]">—</span>
                        </div>
                    </template>
                    <template v-if="column.key === 'createTime'">
                        <div class="flex items-center gap-1.5 whitespace-nowrap text-[13px] text-[#595959]">
                            <ClockCircleOutlined class="text-xs text-[#8c8c8c]" />
                            {{ formatTime(record.createTime) }}
                        </div>
                    </template>
                    <template v-if="column.key === 'reviewStatus'">
                        <a-badge
                            :status="(reviewStatusConfig[record.reviewStatus]?.color as any) ?? 'default'"
                            :text="reviewStatusConfig[record.reviewStatus]?.text ?? '未知'"
                        />
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-space :size="6">
                            <a-tooltip title="编辑">
                                <a-button size="small" type="primary" ghost @click="handleEdit(record.id)">
                                    <span style="display: inline-flex; align-items: center; gap: 4px">
                                        <EditOutlined />编辑
                                    </span>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip title="删除">
                                <a-button size="small" danger @click="handleDelete(record.id)">
                                    <span style="display: inline-flex; align-items: center; gap: 4px">
                                        <DeleteOutlined />删除
                                    </span>
                                </a-button>
                            </a-tooltip>
                            <template v-if="record.reviewStatus === ReviewStatus.REVIEWING">
                                <a-button
                                    size="small"
                                    type="primary"
                                    class="pass-btn"
                                    @click="handleReview(record.id, ReviewStatus.PASS)"
                                >
                                    <span style="display: inline-flex; align-items: center; gap: 4px">
                                        <CheckCircleOutlined />通过
                                    </span>
                                </a-button>
                                <a-button size="small" danger @click="handleReview(record.id, ReviewStatus.REJECT)">
                                    <span style="display: inline-flex; align-items: center; gap: 4px">
                                        <CloseCircleOutlined />拒绝
                                    </span>
                                </a-button>
                            </template>
                        </a-space>
                    </template>
                </template>
                <template #pictureInfo="{ record }">
                    <div class="flex flex-col gap-1.5 text-xs">
                        <div class="flex items-center gap-1.5">
                            <span class="min-w-[28px] text-[11px] text-[#8c8c8c]">格式</span>
                            <a-tag color="purple" class="!m-0 !px-1.5 !py-0 !text-[11px] !leading-[18px]">{{
                                record.picFormat?.toUpperCase()
                            }}</a-tag>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="min-w-[28px] text-[11px] text-[#8c8c8c]">尺寸</span>
                            <span class="text-[12px] text-[#262626]"
                                >{{ record.picWidth }} × {{ record.picHeight }}</span
                            >
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="min-w-[28px] text-[11px] text-[#8c8c8c]">比例</span>
                            <span class="text-[12px] text-[#262626]">{{ record.picScale }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="min-w-[28px] text-[11px] text-[#8c8c8c]">大小</span>
                            <span class="text-[12px] font-medium text-[#1677ff]">{{ formatSize(record.picSize) }}</span>
                        </div>
                    </div>
                </template>
            </a-table>
        </div>

        <!-- 审核拒绝弹窗 -->
        <a-modal
            v-model:open="openMessageModal"
            title="填写拒绝理由"
            ok-text="确认提交"
            cancel-text="取消"
            :width="480"
            @ok="handleMessageOk"
        >
            <div class="py-2">
                <a-textarea
                    v-model:value="messageContent"
                    placeholder="请输入拒绝理由，便于创作者修改后重新提交..."
                    :rows="4"
                    show-count
                    :maxlength="200"
                />
            </div>
        </a-modal>
    </div>
</template>

<style scoped>
.pass-btn {
    background: #52c41a !important;
    border-color: #52c41a !important;
    color: #fff !important;
}

.pass-btn:hover {
    background: #73d13d !important;
    border-color: #73d13d !important;
}

/* 图片缩略图适配 */
:deep(.thumb-img) {
    width: 80px !important;
    height: 80px !important;
    object-fit: cover;
}

:deep(.thumb-img img) {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

/* 表格行 hover */
:deep(.table-row:hover > td) {
    background: #f0f5ff !important;
}

:deep(.ant-table-thead > tr > th) {
    background: #fafafa;
    font-weight: 600;
    color: #262626;
    border-bottom: 2px solid #f0f0f0;
}

:deep(.ant-pagination) {
    margin-top: 16px;
}

/* add-btn hover */
.add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgb(22 119 255 / 30%);
}
</style>
