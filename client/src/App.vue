<script setup lang="ts">
import BasicLayout from '@/layouts/basic-layout/index.vue'
import usePictureStore from '@/store/modules/picture'

const pictureStore = usePictureStore()
pictureStore.getTagCategory()
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
