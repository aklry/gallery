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
                <a-avatar :src="loginUser.userAvatar" v-if="loginUser.userAvatar" alt="个人头像" />
                {{ loginUser.userName ?? '佚名' }}
            </template>
            <template v-else>
                <a-button type="primary" @click="handleClickLogin">登录</a-button>
            </template>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import useGlobalHeaderHooks from './hooks'
const { items, loginUser, current, handleClickLogin, changeRoute } = useGlobalHeaderHooks()
</script>

<style lang="scss" scoped>
@use './css/index' as *;
</style>
