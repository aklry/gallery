<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

onMounted(() => {
    void userStore.fetchLoginUser().catch(() => undefined)
})
</script>

<template>
    <div class="app">
        <router-view />
    </div>
</template>

<style>
.app {
    height: 100%;
}
</style>
