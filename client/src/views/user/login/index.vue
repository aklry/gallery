<template>
    <div class="login-wrapper">
        <!-- 背景装饰 -->
        <div class="glass-bg">
            <div class="glass-shape shape-1"></div>
            <div class="glass-shape shape-2"></div>
        </div>

        <div class="login-content">
            <!-- Slogan 区域 -->
            <div class="slogan-container">
                <h1 class="slogan-title">映刻</h1>
                <p class="slogan-subtitle">探索、收藏、分享你的每一次灵感闪现</p>
            </div>

            <!-- Login 登录卡片 -->
            <div class="login-container">
                <div class="glass-card">
                    <h2 class="card-title">欢迎回来</h2>
                    <p class="card-desc">登录以继续</p>
                    <a-tabs v-model:activeKey="tabKey" centered>
                        <a-tab-pane key="account" tab="账号登录">
                            <a-form
                                :model="loginForm"
                                name="accountLogin"
                                autocomplete="off"
                                @finish="handleSubmit"
                                class="login-form"
                            >
                                <a-form-item
                                    name="userAccount"
                                    :rules="[{ required: true, message: '请输入用户账号!' }]"
                                >
                                    <a-input
                                        v-model:value="loginForm.userAccount"
                                        size="large"
                                        placeholder="请输入用户账号"
                                    >
                                        <template #prefix>
                                            <UserOutlined />
                                        </template>
                                    </a-input>
                                </a-form-item>

                                <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                                    <a-input-password
                                        v-model:value="loginForm.userPassword"
                                        size="large"
                                        placeholder="请输入密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>
                                <div class="flex justify-end mb-4">
                                    <router-link
                                        to="/user/register"
                                        class="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        没有账户？去注册
                                    </router-link>
                                </div>

                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                        size="large"
                                        :loading="loading"
                                        block
                                        class="login-btn"
                                    >
                                        登 录
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>

                        <a-tab-pane key="email" tab="邮箱登录">
                            <a-form
                                :model="loginForm"
                                name="emailLogin"
                                autocomplete="off"
                                @finish="handleSubmit"
                                class="login-form"
                            >
                                <a-form-item
                                    name="userEmail"
                                    :rules="[
                                        { required: true, message: '请输入邮箱!' },
                                        { type: 'email', message: '请输入正确的邮箱格式!' }
                                    ]"
                                >
                                    <a-input v-model:value="loginForm.userEmail" size="large" placeholder="请输入邮箱">
                                        <template #prefix>
                                            <UserOutlined />
                                        </template>
                                    </a-input>
                                </a-form-item>

                                <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                                    <a-input-password
                                        v-model:value="loginForm.userPassword"
                                        size="large"
                                        placeholder="请输入密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>

                                <div class="flex justify-end mb-4">
                                    <router-link
                                        to="/user/register"
                                        class="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        没有账户？去注册
                                    </router-link>
                                </div>

                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                        size="large"
                                        :loading="loading"
                                        block
                                        class="login-btn"
                                    >
                                        登 录
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                    </a-tabs>
                    <div id="aliyun-captcha-element"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import useLogin from './hooks'

const { tabKey, loginForm, handleSubmit, loading } = useLogin()
</script>

<style lang="scss" scoped>
@use './css/index' as *;

:deep(.ant-tabs-nav) {
    margin-bottom: 24px;

    &::before {
        border-bottom-color: #e2e8f0;
    }
}

:deep(.ant-tabs-tab) {
    color: #64748b;

    &:hover {
        color: #1e293b;
    }
}

:deep(.ant-tabs-tab-active) {
    .ant-tabs-tab-btn {
        color: #1e293b;
        text-shadow: 0 0 0.25px currentcolor;
    }
}

:deep(.ant-tabs-ink-bar) {
    background: #3b82f6;
}
</style>
