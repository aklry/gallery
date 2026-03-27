<script setup lang="ts">
import { HomeFilled, FileOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useGlobalSider } from './hooks'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const { handleClick, current } = useGlobalSider()
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

const menuList = [
    { key: '/', icon: HomeFilled, title: '公共图库' },
    { key: '/space/user', icon: FileOutlined, title: '我的空间' },
    { key: '/user/message', icon: MessageOutlined, title: '我的消息' },
    { key: '/user/center', icon: UserOutlined, title: '个人中心' }
]
</script>
<template>
    <div class="global-sider">
        <!-- 用户头像 -->
        <div class="sider-avatar" @click="handleClick('/user/center')">
            <a-avatar :size="40" :src="loginUser.userAvatar" v-if="loginUser.userAvatar" />
            <a-avatar :size="40" src="/logo.svg" v-else></a-avatar>
            <div class="avatar-status"></div>
        </div>

        <!-- 导航图标 -->
        <nav class="sider-nav">
            <a-tooltip v-for="item in menuList" :key="item.key" :title="item.title" placement="right">
                <div class="nav-item" :class="{ active: current.includes(item.key) }" @click="handleClick(item.key)">
                    <component :is="item.icon" class="nav-icon" />
                </div>
            </a-tooltip>
        </nav>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
