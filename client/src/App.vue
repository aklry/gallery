<script setup lang="ts">
import { onMounted } from 'vue'
import { test } from './api/index'
onMounted(async () => {
    const res = await test()
    console.log(res)
})
</script>

<template>
    <router-link to="/">主页</router-link>
    <router-link to="/about">关于我们</router-link>
    <router-view />
</template>

<style scoped></style>
