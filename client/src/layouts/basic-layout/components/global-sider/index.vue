<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    HomeFilled,
    FileOutlined,
    MessageOutlined,
    UserOutlined,
    LeftOutlined,
    RightOutlined,
    PlusCircleOutlined,
    FolderAddOutlined,
    TeamOutlined,
    PictureOutlined,
    FolderOpenOutlined
} from '@ant-design/icons-vue'
import { useGlobalSider } from './hooks'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const { handleClick, current } = useGlobalSider()
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

const isCollapsed = ref(false)

const handleAvatarClick = () => {
    if (loginUser.value && loginUser.value.id) {
        handleClick('/user/center')
    } else {
        handleClick('/user/login')
    }
}

const menuList = computed(() => {
    // 基础公共路由
    const list = [{ key: '/', icon: HomeFilled, title: '公共图库' }]

    // 登录后可见路由
    if (loginUser.value && loginUser.value.id) {
        list.push(
            { key: '/picture/add', icon: PlusCircleOutlined, title: '创建图片' },
            { key: '/space/add', icon: FolderAddOutlined, title: '创建空间' },
            { key: '/space/user', icon: FileOutlined, title: '我的空间' },
            { key: '/user/message', icon: MessageOutlined, title: '我的消息' },
            { key: '/user/center', icon: UserOutlined, title: '个人中心' }
        )
    }

    // 管理员可见路由
    if (loginUser.value && loginUser.value.userRole === 'admin') {
        list.push(
            { key: '/user/admin', icon: TeamOutlined, title: '用户管理' },
            { key: '/picture/admin', icon: PictureOutlined, title: '图片管理' },
            { key: '/space/admin', icon: FolderOpenOutlined, title: '空间管理' }
        )
    }
    return list
})
</script>
<template>
    <div class="global-sider" :class="{ collapsed: isCollapsed }">
        <!-- 收缩展开按钮 -->
        <div class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <component :is="isCollapsed ? RightOutlined : LeftOutlined" class="collapse-icon" />
        </div>

        <!-- 用户头像 -->
        <div class="sider-avatar" @click="handleAvatarClick">
            <a-tooltip :title="loginUser?.id ? loginUser.userName || '个人中心' : '未登录，点击登录'" placement="right">
                <a-avatar :size="40" :src="loginUser.userAvatar" v-if="loginUser?.userAvatar" />
                <a-avatar :size="40" src="/logo.svg" v-else></a-avatar>
            </a-tooltip>
            <div class="avatar-status" :class="{ 'is-offline': !loginUser?.id }"></div>
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
