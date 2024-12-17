<template>
    <div class="layout h-[100vh] overflow-hidden">
        <a-layout class="h-full">
            <a-layout-header>
                <global-header />
            </a-layout-header>
            <a-layout-content class="content">
                <router-view />
            </a-layout-content>
            <a-layout-footer>
                <global-footer />
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import GlobalHeader from './global-header/index.vue'
import GlobalFooter from './global-footer/index.vue'
</script>

<style lang="scss" scoped>
.ant-layout-header {
    @apply bg-white;

    padding-inline: 20px;
}

.ant-layout-footer {
    @apply bg-white p-0 h-[64px];
}

.content {
    background: linear-gradient(to bottom, #fefefe, #fff);
    @apply p-[20px] pb-[64px] overflow-auto;

    height: calc(100vh - 64px - 64px);
}
</style>
