<template>
    <a-row>
        <a-col flex="150px" class="mr-[20px]">
            <a href="http://docs.aklry.com" target="_blank">
                <img src="../../../assets/images/logo.png" alt="画云间" class="w-[50px]" />
            </a>
            <div class="text-[24px] font-bold ml-[10px]">画云间</div>
        </a-col>
        <a-col flex="auto">
            <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="changeRoute" />
        </a-col>
        <a-col flex="150px">
            <template v-if="loginUser && loginUser.id">
                <a-dropdown>
                    <a class="ant-dropdown-link" @click.prevent>
                        <a-avatar :src="loginUser.userAvatar" v-if="loginUser.userAvatar" alt="个人头像" />
                        {{ loginUser.userName ?? '佚名' }}
                        <DownOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a-menu-item>
                                    <UserOutlined class="mr-[10px]" />
                                    <span>个人中心</span>
                                </a-menu-item>
                                <a-menu-item @click="handleLogout">
                                    <LogoutOutlined class="mr-[10px]" />
                                    <span>退出登录</span>
                                </a-menu-item>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
            <template v-else>
                <a-button type="primary" @click="handleClickLogin">登录</a-button>
            </template>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useMenus } from '../hooks'

const router = useRouter()
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
const current = ref<string[]>(['home'])
const { items } = useMenus()
const handleClickLogin = () => {
    router.push({
        path: '/user/login'
    })
}
const handleLogout = async () => {
    await userStore.userLogout()
    router.push('/user/login')
}
const changeRoute = ({ key }: { key: string }) => {
    router.push({
        path: key
    })
}
router.afterEach(to => {
    current.value = [to.path]
})
</script>

<style lang="scss" scoped>
.ant-row {
    @apply w-full h-full items-center;

    .ant-col {
        &:first-child {
            @apply flex items-center h-[50px];
        }
    }
}

.ant-menu-horizontal {
    @apply border-none;
}
</style>
