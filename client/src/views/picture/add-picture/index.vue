<template>
    <div class="add-picture">
        <picture-upload :onUploadSuccess="handleUploadSuccess" v-model:imageUrl="imageUrl" />
    </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/picture-upload/index.vue'
import { ref } from 'vue'
const imageUrl = ref<string>('')
const handleUploadSuccess = (url: string) => {
    imageUrl.value = url
}
</script>

<style scoped></style>
