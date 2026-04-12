<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { messageControllerFindAllNewMessageV1 } from '@/api/message'
import { useRoute } from 'vue-router'
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
const unreadCount = ref(0)
const route = useRoute()

const fetchUnreadCount = async () => {
    if (loginUser.value && loginUser.value.id) {
        try {
            const res = await messageControllerFindAllNewMessageV1({ page: 1, pageSize: 1 } as any)
            unreadCount.value = res.data.total || 0
        } catch (error) {
            // ignore
        }
    } else {
        unreadCount.value = 0
    }
}

onMounted(() => {
    fetchUnreadCount()
})

watch(
    () => route.path,
    () => {
        fetchUnreadCount()
    }
)

watch(
    () => loginUser.value,
    () => {
        fetchUnreadCount()
    }
)

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

        <!-- 用户头像/登录入口 -->
        <div class="sider-avatar-wrapper" @click="handleAvatarClick">
            <!-- 已登录状态 -->
            <template v-if="loginUser?.id">
                <a-tooltip :title="loginUser.userName || '个人中心'" placement="right">
                    <div class="sider-avatar">
                        <a-avatar :size="40" :src="loginUser.userAvatar" />
                        <div class="avatar-status is-online"></div>
                    </div>
                </a-tooltip>
            </template>
            <!-- 未登录状态 -->
            <template v-else>
                <a-tooltip title="请先登录 >" placement="right" color="#1677ff" :overlayStyle="{ cursor: 'pointer' }">
                    <div class="sider-avatar unlogin-avatar">
                        <a-avatar :size="40" class="login-avatar-bg">
                            <template #icon><UserOutlined class="unlogin-icon" /></template>
                        </a-avatar>
                        <!-- 提示橙点 -->
                        <div class="pulse-dot"></div>
                    </div>
                </a-tooltip>
            </template>
        </div>

        <!-- 导航图标 -->
        <nav class="sider-nav">
            <a-tooltip v-for="item in menuList" :key="item.key" :title="item.title" placement="right">
                <div class="nav-item" :class="{ active: current.includes(item.key) }" @click="handleClick(item.key)">
                    <a-badge
                        v-if="item.key === '/user/message'"
                        :count="unreadCount"
                        :numberStyle="{
                            fontSize: '10px',
                            minWidth: '16px',
                            height: '16px',
                            lineHeight: '16px',
                            padding: '0 4px'
                        }"
                        :offset="[2, 0]"
                    >
                        <component :is="item.icon" class="nav-icon" />
                    </a-badge>
                    <component v-else :is="item.icon" class="nav-icon" />
                </div>
            </a-tooltip>
        </nav>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
