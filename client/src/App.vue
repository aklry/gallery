<script setup lang="ts">
import BasicLayout from '@/layouts/basic-layout/index.vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
userStore.fetchLoginUser()
</script>

<template>
    <div class="app">
        <basic-layout />
    </div>
</template>

<style>
.app {
    height: 100vh;
}
</style>
