<template>
    <div class="user-message">
        <div class="message-header">
            <h2 class="message-title">我的消息</h2>
            <a-button type="primary" :disabled="!hasUnread" :loading="readAllLoading" @click="handleReadAllMessage">
                <template #icon><CheckOutlined /></template>
                全部已读
            </a-button>
        </div>

        <div class="message-tabs">
            <a-tabs v-model:activeKey="currentKey">
                <a-tab-pane key="1">
                    <template #tab>
                        <span class="tab-label">
                            <BellOutlined />
                            最新消息
                            <a-badge
                                v-if="newUnreadCount > 0"
                                :count="newUnreadCount"
                                :numberStyle="{ fontSize: '11px' }"
                                class="tab-badge"
                            />
                        </span>
                    </template>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span class="tab-label">
                            <HistoryOutlined />
                            历史消息
                            <a-badge
                                v-if="historyUnreadCount > 0"
                                :count="historyUnreadCount"
                                :numberStyle="{ fontSize: '11px' }"
                                class="tab-badge"
                            />
                        </span>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>

        <a-spin :spinning="loading">
            <div v-if="currentMessageList && currentMessageList.length > 0" class="message-list">
                <div
                    v-for="item in currentMessageList"
                    :key="item.id"
                    class="message-item"
                    :class="{ 'message-item--unread': item.hasRead === MessageStatus.UNREAD }"
                    @click="handleMessageClick(item)"
                >
                    <div class="message-item__indicator">
                        <span v-if="item.hasRead === MessageStatus.UNREAD" class="unread-dot" />
                    </div>
                    <div class="message-item__content">
                        <div class="message-item__title">{{ item.title }}</div>
                        <div class="message-item__desc">{{ item.content }}</div>
                    </div>
                    <div class="message-item__action">
                        <a-tag v-if="item.hasRead === MessageStatus.UNREAD" color="blue">未读</a-tag>
                        <a-tag v-else color="default">已读</a-tag>
                    </div>
                </div>
            </div>

            <a-empty
                v-else-if="!loading"
                class="message-empty"
                :image="Empty.PRESENTED_IMAGE_SIMPLE"
                description="暂无消息"
            />
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue'
import { BellOutlined, HistoryOutlined, CheckOutlined } from '@ant-design/icons-vue'
import useMessage from './hooks'
import { MessageStatus } from '@/constants'

const {
    currentKey,
    currentMessageList,
    loading,
    readAllLoading,
    hasUnread,
    newUnreadCount,
    historyUnreadCount,
    handleMessageClick,
    handleReadAllMessage
} = useMessage()
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
