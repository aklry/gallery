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
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import useLogin from './hooks'

const { loginForm, handleSubmit, loading } = useLogin()
</script>

<style lang="scss" scoped>
@use './css/index' as *;
</style>
