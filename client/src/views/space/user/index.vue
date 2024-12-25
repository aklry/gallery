<script setup lang="ts">
import { useUserSpace } from './hooks'

useUserSpace()
</script>
<template>
    <div class="user-space">
        <a-spin tip="正在跳转，请稍等..." />
    </div>
</template>
<style scoped lang="scss">
.user-space {
    @apply h-full w-full flex justify-center items-center;
}
</style>
