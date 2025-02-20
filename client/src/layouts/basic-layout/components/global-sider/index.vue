<script setup lang="ts">
import { useGlobalSider } from './hooks'
const { siderStyle, handleClick, menuItems, current } = useGlobalSider()
</script>
<template>
    <div class="global-sider">
        <a-layout-sider :style="siderStyle">
            <div class="flex items-center pl-[20px] h-[60px]">
                <a href="http://docs.aklry.com" target="_blank">
                    <img src="/logo.svg" alt="画云间" class="w-[50px]" />
                </a>
                <div class="text-[24px] font-bold ml-[10px]">画云间</div>
            </div>
            <a-menu :items="menuItems" @click="handleClick" v-model:selectedKeys="current" />
        </a-layout-sider>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
