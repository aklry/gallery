<template>
    <div class="layout flex h-[100vh] overflow-hidden">
        <global-sider />
        <a-layout class="h-full min-w-0 flex-1">
            <a-layout-content class="content min-w-0">
                <router-view />
            </a-layout-content>
            <a-layout-footer>
                <global-footer />
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import GlobalFooter from './components/global-footer/index.vue'
import GlobalSider from './components/global-sider/index.vue'

import { useMessageStream } from '@/hooks/useMessageStream'
useMessageStream()
</script>

<style lang="scss" scoped>
@use './css/index' as *;
</style>
