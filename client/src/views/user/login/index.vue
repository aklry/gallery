<template>
    <div class="flex justify-center items-center bg-gray-50 h-full">
        <a-card class="w-full max-w-md mx-4 shadow-lg rounded-lg" title="源空间-用户登录" :bordered="false">
            <a-form :model="loginForm" name="login" autocomplete="off" @finish="handleSubmit">
                <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入用户账号!' }]">
                    <a-input v-model:value="loginForm.userAccount" size="large" placeholder="请输入用户账号">
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                    <a-input-password v-model:value="loginForm.userPassword" size="large" placeholder="请输入密码">
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>
                <div class="text-right mb-2">
                    <router-link to="/user/register" class="text-blue-500 hover:text-blue-700"
                        >没有账户？去注册
                    </router-link>
                </div>

                <a-form-item>
                    <a-button type="primary" html-type="submit" size="large" :loading="loading" block> 登录 </a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userControllerUserLoginV1 } from '@/api/user'
import { MD5 } from 'crypto-js'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const loginForm = reactive<API.UserLoginDto>({
    userAccount: '',
    userPassword: ''
})

const handleSubmit = async (values: API.UserLoginDto) => {
    try {
        loading.value = true
        const res = await userControllerUserLoginV1({
            userAccount: values.userAccount,
            userPassword: MD5(values.userPassword).toString()
        })
        if (res.code === 1) {
            await userStore.setLoginUser(res.data)
            message.success('登录成功')
            router.push('/')
        } else {
            message.error(res.message)
        }
    } catch (error) {
        message.error('登录失败，请重试')
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
// 自定义样式
.ant-card {
    @apply bg-white;
}

.ant-card-head {
    @apply border-b border-gray-100;
}

:deep(.ant-card-head-title) {
    @apply text-center text-2xl py-3 font-medium text-gray-800;
}

.ant-card-body {
    @apply p-6;
}

.ant-form-item {
    &:last-child {
        @apply mb-0;
    }
}
</style>
