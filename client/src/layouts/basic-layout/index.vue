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
import GlobalHeader from './components/global-header/index.vue'
import GlobalFooter from './components/global-footer/index.vue'
</script>

<style lang="scss" scoped>
@use './css/index' as *;
</style>
