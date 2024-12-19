<template>
    <div class="user-message">
        <a-card>
            <template #title>
                <a-tabs v-model:activeKey="currentKey">
                    <a-tab-pane key="1" tab="最新消息"></a-tab-pane>
                    <a-tab-pane key="2" tab="历史消息"></a-tab-pane>
                </a-tabs>
            </template>
            <template #extra>
                <a-button type="primary" @click="handleReadAllMessage">全部已读</a-button>
            </template>
            <a-list :dataSource="currentMessageList">
                <template #renderItem="{ item }: { item: API.MessageVoModel }">
                    <a-list-item @click="handleMessageClick(item)" class="mt-2">
                        <a-list-item-meta :description="item.content">
                            <template #title>
                                <a-badge :dot="item.hasRead === MessageStatus.UNREAD" :offset="[2, -2]">
                                    {{ item.title }}
                                </a-badge>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import useMessage from './hooks'
import { MessageStatus } from '@/constants'
const { currentKey, currentMessageList, handleMessageClick, handleReadAllMessage } = useMessage()
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
