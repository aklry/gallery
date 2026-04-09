<template>
    <div class="user-admin-container p-4 lg:p-6 bg-[#f0f2f5] min-h-screen">
        <a-card class="mb-4 rounded-xl shadow-sm border-0" :bodyStyle="{ padding: '24px 24px 0 24px' }">
            <a-form layout="inline" class="flex flex-wrap gap-y-4 mb-4">
                <a-form-item label="用户名">
                    <a-input v-model:value="searchParams.userName" placeholder="请输入用户名" allowClear class="w-48" />
                </a-form-item>
                <a-form-item label="账号">
                    <a-input
                        v-model:value="searchParams.userAccount"
                        placeholder="请输入账号"
                        allowClear
                        class="w-48"
                    />
                </a-form-item>
                <a-form-item class="ml-auto mr-0">
                    <a-button type="primary" class="mr-2" @click="handleSearch"> 查询 </a-button>
                    <a-button @click="handleReset"> 重置 </a-button>
                </a-form-item>
            </a-form>
        </a-card>

        <a-card class="rounded-xl shadow-sm border-0 overflow-hidden" title="用户管理列表">
            <a-table
                :dataSource="dataSource"
                :columns="columns"
                :pagination="{
                    total,
                    current: Number(searchParams.current),
                    pageSize: Number(searchParams.pageSize),
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    showTotal: (total: number) => `共 ${total} 条`
                }"
                @change="handleChange"
                rowKey="id"
                class="modern-table"
                :scroll="{ x: 'max-content' }"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'userAvatar'">
                        <a-avatar :src="record.userAvatar" v-if="record.userAvatar" />
                        <a-avatar src="/logo.svg" v-else />
                    </template>
                    <template v-if="column.dataIndex === 'userName'">
                        {{ record.userName || '未知用户' }}
                    </template>
                    <template v-if="column.dataIndex === 'createTime'">
                        {{ formatTime(record.createTime) }}
                    </template>
                    <template v-if="column.dataIndex === 'userRole'">
                        <a-tag :color="record.userRole === 'admin' ? 'blue' : 'default'" class="px-2 py-1 rounded-md">
                            {{ record.userRole === 'admin' ? '管理员' : '普通用户' }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" danger class="px-0" @click="handleDelete(record.id)">删除</a-button>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import useAdmin from './hooks'
import { formatTime } from '@/utils'

const {
    columns,
    dataSource,
    total,
    searchParams,
    handleChange,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleReset
} = useAdmin()
</script>

<style scoped lang="scss">
.user-admin-container {
    :deep(.ant-card-head) {
        border-bottom: 1px solid #f0f0f0;
        font-weight: 600;
        padding: 0 24px;
        min-height: 56px;
    }

    :deep(.ant-table-wrapper) {
        .ant-table-thead > tr > th {
            background-color: #fafafa;
        }
    }
}
</style>
