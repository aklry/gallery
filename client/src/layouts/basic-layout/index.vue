<template>
    <div class="layout h-[100vh]">
        <a-layout class="h-full">
            <a-layout-header>
                <global-header />
            </a-layout-header>
            <a-layout-content>
                <router-view />
            </a-layout-content>
            <a-layout-footer>
                <div class="h-full w-full text-center leading-[64px]">
                    <a href="http://docs.aklry.com" target="_blank">Copyright &copy; aklry 2024</a>
                </div>
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import GlobalHeader from './global-header/index.vue'
</script>

<style lang="scss" scoped>
.ant-layout-header {
    @apply bg-white;
}

.ant-layout-footer {
    @apply bg-white p-0 h-[64px];
}
</style>
