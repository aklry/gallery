<template>
    <div class="bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <a-card class="shadow-lg rounded-lg">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">注册</h1>
                </div>
                <a-form :model="formState" name="registerForm" autocomplete="off" @finish="onFinish">
                    <a-form-item
                        label="用户账户"
                        name="userAccount"
                        :rules="[{ required: true, message: '请输入用户账户!' }]"
                    >
                        <a-input v-model:value="formState.userAccount" class="rounded-md" />
                    </a-form-item>

                    <a-form-item label="密码" name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                        <a-input-password v-model:value="formState.userPassword" class="rounded-md" />
                    </a-form-item>

                    <a-form-item
                        label="确认密码"
                        name="checkedPassword"
                        :rules="[{ required: true, message: '请确认密码!' }]"
                    >
                        <a-input-password v-model:value="formState.checkedPassword" class="rounded-md" />
                    </a-form-item>

                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="w-full rounded-md bg-blue-600 hover:bg-blue-700 py-2"
                        >
                            注册
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { MD5 } from 'crypto-js'
import { message } from 'ant-design-vue'
import { userControllerUserRegisterV1 } from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const formState = reactive<API.UserRegisterDto>({
    userAccount: '',
    userPassword: '',
    checkedPassword: ''
})
const onFinish = async () => {
    const { userPassword, checkedPassword } = formState
    const md5Password = MD5(userPassword).toString()
    const md5CheckedPassword = MD5(checkedPassword).toString()
    if (md5Password !== md5CheckedPassword) {
        message.error('两次密码不一致')
        return
    }
    try {
        const res = await userControllerUserRegisterV1({
            userAccount: formState.userAccount,
            userPassword: md5Password,
            checkedPassword: md5CheckedPassword
        })
        if (res.code === 1) {
            message.success('注册成功')
            router.push('/user/login')
        } else {
            message.error(res.message)
        }
    } catch (error) {
        message.error('注册失败')
    }
}
</script>

<style scoped></style>
