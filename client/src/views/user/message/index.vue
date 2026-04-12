<template>
    <div class="user-message">
        <div class="message-header glass-header">
            <h2 class="message-title">我的消息</h2>
            <a-button
                type="primary"
                shape="round"
                :disabled="!hasUnread"
                :loading="readAllLoading"
                @click="handleReadAllMessage"
            >
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

        <div class="message-scroll-area">
            <a-spin :spinning="loading" wrapperClassName="h-full">
                <div v-if="currentMessageList && currentMessageList.length > 0" class="message-list">
                    <div
                        v-for="item in currentMessageList"
                        :key="item.id"
                        class="message-item"
                        :class="{ 'message-item--unread': item.hasRead === MessageStatus.UNREAD }"
                        @click="handleMessageClick(item)"
                    >
                        <div class="message-item__indicator">
                            <span v-if="item.hasRead === MessageStatus.UNREAD" class="unread-dot hidden" />
                            <div
                                class="icon-wrapper"
                                :class="
                                    item.hasRead === MessageStatus.UNREAD
                                        ? 'bg-blue-100 text-blue-500'
                                        : 'bg-gray-100 text-gray-400'
                                "
                            >
                                <BellOutlined v-if="item.hasRead === MessageStatus.UNREAD" />
                                <HistoryOutlined v-else />
                            </div>
                        </div>
                        <div class="message-item__content flex-1 overflow-hidden">
                            <div class="message-item__header-row flex justify-between items-center mb-1">
                                <h3 class="message-item__title text-base font-medium text-gray-800 truncate m-0">
                                    {{ item.title }}
                                </h3>
                                <time class="message-item__time text-xs text-gray-400 shrink-0">{{
                                    formatTime(item.createTime)
                                }}</time>
                            </div>
                            <div class="message-item__desc text-sm text-gray-600 flex items-start gap-2 mt-1">
                                <a-tag
                                    v-if="item.result !== undefined"
                                    :color="item.result === ReviewStatus.REJECT ? 'error' : 'success'"
                                    :bordered="false"
                                >
                                    {{ ReviewMessage[item.result as ReviewStatus] }}
                                </a-tag>
                                <span class="break-all">{{ item.content }}</span>
                            </div>
                        </div>
                        <div class="message-item__action">
                            <a-tag v-if="item.hasRead === MessageStatus.UNREAD" color="blue" class="rounded-full px-3"
                                >未读</a-tag
                            >
                            <a-tag v-else color="default" class="rounded-full px-3">已读</a-tag>
                        </div>
                    </div>
                </div>

                <div v-else-if="!loading" class="message-empty">
                    <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="暂无消息" />
                </div>
            </a-spin>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue'
import { BellOutlined, HistoryOutlined, CheckOutlined } from '@ant-design/icons-vue'
import useMessage from './hooks'
import { MessageStatus, ReviewMessage, ReviewStatus } from '@/constants'
import { formatTime } from '@/utils'

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
