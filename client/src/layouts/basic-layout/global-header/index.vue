<template>
    <a-row>
        <a-col flex="150px" class="mr-[20px]">
            <a href="http://docs.aklry.com" target="_blank">
                <img src="http://quiz.aklry.com/logo.png" alt="源空间" class="w-[50px]" />
            </a>
            <div class="text-[24px] font-bold ml-[10px]">源空间</div>
        </a-col>
        <a-col flex="auto">
            <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="changeRoute" />
        </a-col>
        <a-col flex="150px">
            <template v-if="loginUser && loginUser.id">
                <div class="text-[16px] text-center">{{ loginUser.userName ?? '佚名' }}</div>
            </template>
            <template v-else>
                <a-button type="primary" href="/user/login">登录</a-button>
            </template>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
const current = ref<string[]>(['home'])
const changeRoute = ({ key }: { key: string }) => {
    router.push({
        path: key
    })
}
const items = ref<MenuProps['items']>([
    {
        key: '/',
        label: '主页',
        title: '主页',
        icon: () => h(HomeOutlined)
    },
    {
        key: '/about',
        label: '关于',
        title: '关于'
    }
])
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
