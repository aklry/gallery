<template>
    <div class="home">
        <h1>主页</h1>
    </div>
</template>

<script setup lang="ts">
import { appControllerTestV1 } from '@/api/app'
import { onMounted } from 'vue'

onMounted(async () => {
    const res = await appControllerTestV1()
    console.log(res)
})
</script>

<style scoped></style>
