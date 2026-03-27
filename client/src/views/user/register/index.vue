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
                <h1 class="slogan-title">源空间</h1>
                <p class="slogan-subtitle">加入我们，记录和分享你的每一次灵感闪现</p>
            </div>

            <!-- Register 登录卡片 -->
            <div class="login-container">
                <div class="glass-card">
                    <h2 class="card-title">创建账户</h2>
                    <p class="card-desc">注册以加入</p>
                    <a-tabs v-model:activeKey="tabKey" centered>
                        <a-tab-pane key="account" tab="账号注册">
                            <a-form
                                :model="formState"
                                name="accountRegisterForm"
                                autocomplete="off"
                                @finish="onFinish"
                                class="login-form"
                            >
                                <a-form-item
                                    name="userAccount"
                                    :rules="[{ required: true, message: '请输入用户账号!' }]"
                                >
                                    <a-input
                                        v-model:value="formState.userAccount"
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
                                        v-model:value="formState.userPassword"
                                        size="large"
                                        placeholder="请输入密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>

                                <a-form-item
                                    name="checkedPassword"
                                    :rules="[{ required: true, message: '请确认密码!' }]"
                                >
                                    <a-input-password
                                        v-model:value="formState.checkedPassword"
                                        size="large"
                                        placeholder="请确认密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>

                                <div class="flex justify-end mb-4">
                                    <router-link
                                        to="/user/login"
                                        class="text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        已有账户？去登录
                                    </router-link>
                                </div>

                                <a-form-item>
                                    <a-button type="primary" html-type="submit" size="large" block class="login-btn">
                                        注 册
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>

                        <a-tab-pane key="email" tab="邮箱注册">
                            <a-form
                                :model="formState"
                                name="emailRegisterForm"
                                autocomplete="off"
                                @finish="onFinish"
                                class="login-form"
                            >
                                <a-form-item
                                    name="userEmail"
                                    :rules="[
                                        { required: true, message: '请输入邮箱!' },
                                        { type: 'email', message: '请输入正确的邮箱格式!' }
                                    ]"
                                >
                                    <a-input v-model:value="formState.userEmail" size="large" placeholder="请输入邮箱">
                                        <template #prefix>
                                            <MailOutlined />
                                        </template>
                                    </a-input>
                                </a-form-item>

                                <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
                                    <div class="flex gap-2">
                                        <a-input
                                            v-model:value="formState.code"
                                            size="large"
                                            class="flex-1"
                                            placeholder="请输入验证码"
                                        >
                                            <template #prefix>
                                                <SafetyCertificateOutlined />
                                            </template>
                                        </a-input>
                                        <a-button
                                            :disabled="countdown > 0"
                                            :loading="isSending"
                                            @click="sendCode"
                                            size="large"
                                            class="h-auto px-4 !rounded-xl border-none !bg-white/10 hover:!bg-white/20 !text-white !font-medium transition-colors backdrop-blur"
                                        >
                                            {{ countdown > 0 ? `${countdown}秒后重新发送` : '获取验证码' }}
                                        </a-button>
                                    </div>
                                </a-form-item>

                                <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                                    <a-input-password
                                        v-model:value="formState.userPassword"
                                        size="large"
                                        placeholder="请输入密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>

                                <a-form-item
                                    name="checkedPassword"
                                    :rules="[{ required: true, message: '请确认密码!' }]"
                                >
                                    <a-input-password
                                        v-model:value="formState.checkedPassword"
                                        size="large"
                                        placeholder="请确认密码"
                                    >
                                        <template #prefix>
                                            <LockOutlined />
                                        </template>
                                    </a-input-password>
                                </a-form-item>

                                <div class="flex justify-end mb-4">
                                    <router-link
                                        to="/user/login"
                                        class="text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        已有账户？去登录
                                    </router-link>
                                </div>

                                <a-form-item>
                                    <a-button type="primary" html-type="submit" size="large" block class="login-btn">
                                        注 册
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import useRegister from './hooks'

const { tabKey, formState, countdown, isSending, sendCode, onFinish } = useRegister()
</script>

<style lang="scss" scoped>
@use '../login/css/index' as *;

:deep(.ant-tabs-nav) {
    margin-bottom: 24px;

    &::before {
        border-bottom-color: rgb(255 255 255 / 20%);
    }
}

:deep(.ant-tabs-tab) {
    color: rgb(255 255 255 / 65%);

    &:hover {
        color: white;
    }
}

:deep(.ant-tabs-tab-active) {
    .ant-tabs-tab-btn {
        color: white;
        text-shadow: 0 0 0.25px currentcolor;
    }
}

:deep(.ant-tabs-ink-bar) {
    background: white;
}
</style>
