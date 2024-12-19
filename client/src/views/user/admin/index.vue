<template>
    <div class="user-admin-container">
        <a-table
            :dataSource="dataSource"
            :columns="columns"
            :pagination="{
                total,
                current: Number(searchParams.current),
                pageSize: Number(searchParams.pageSize),
                onChange: handlePageChange
            }"
            @change="handleChange"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'userName'">
                    {{ record.userName || '佚名' }}
                </template>
                <template v-if="column.dataIndex === 'createTime'">
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.dataIndex === 'userRole'">
                    <a-tag :color="record.userRole === 'admin' ? 'green' : 'blue'">
                        {{ record.userRole }}
                    </a-tag>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-button type="primary" class="mr-[10px]">编辑</a-button>
                    <a-button type="primary" danger @click="handleDelete(record.id)">删除</a-button>
                </template>
                <template v-if="column.dataIndex === 'userAvatar'">
                    <a-image :src="record.userAvatar" width="50" />
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import useAdmin from './hooks'

const { columns, dataSource, total, searchParams, handleChange, handleDelete, handlePageChange } = useAdmin()
</script>

<style scoped lang="scss"></style>
