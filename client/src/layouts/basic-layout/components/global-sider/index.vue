<script setup lang="ts">
import { ref, h } from 'vue'
import { useGlobalSider } from './hooks'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

const { siderStyle, handleClick, menuItems, current } = useGlobalSider()
const collapsed = ref(true)
const showToggle = ref(false)

const toggleCollapse = () => {
    collapsed.value = !collapsed.value
}
</script>
<template>
    <div class="global-sider" @mouseenter="showToggle = true" @mouseleave="showToggle = false">
        <a-layout-sider
            :style="siderStyle"
            :collapsed="collapsed"
            :collapsed-width="64"
            :width="200"
            :trigger="null"
            collapsible
        >
            <div v-if="!collapsed" class="sider-header">
                <a href="http://docs.aklry.com" target="_blank">
                    <img src="/logo.svg" alt="画云间" class="logo-img" />
                </a>
                <div class="logo-text">画云间</div>
            </div>
            <a-menu :items="menuItems" v-model:selectedKeys="current" @click="handleClick" />
            <a-button
                v-show="showToggle"
                class="absolute top-1/2 -right-2 transform -translate-y-1/2"
                type="button"
                @click.stop="toggleCollapse"
                :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
                size="large"
            />
        </a-layout-sider>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
