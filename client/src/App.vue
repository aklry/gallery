<script setup lang="ts">
import usePictureStore from '@/store/modules/picture'

const pictureStore = usePictureStore()
pictureStore.getTagCategory()
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
