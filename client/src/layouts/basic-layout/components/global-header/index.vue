<template>
    <a-row>
        <a-col flex="auto">
            <a-menu
                v-model:selectedKeys="current"
                mode="horizontal"
                :items="items"
                class="w-full"
                @click="changeRoute"
            />
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
                                <a-menu-item @click="changeRoute({ key: '/user/center' })">
                                    <UserOutlined class="mr-[10px]" />
                                    <span>个人中心</span>
                                </a-menu-item>
                                <a-menu-item @click="changeRoute({ key: '/user/message' })">
                                    <MessageOutlined class="mr-[10px]" />
                                    <span>我的消息</span>
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
import { DownOutlined, UserOutlined, LogoutOutlined, MessageOutlined } from '@ant-design/icons-vue'
import useGlobalHeaderHooks from './hooks'
const { items, loginUser, current, handleClickLogin, handleLogout, changeRoute } = useGlobalHeaderHooks()
</script>

<style lang="scss" scoped>
@use './css/index' as *;
</style>
