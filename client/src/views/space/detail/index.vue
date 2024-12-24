<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const spaceId = route.params.id
console.log(spaceId)
</script>
<template>
    <div class="index-container">
        <h1>{{ spaceId }}</h1>
    </div>
</template>
<style scoped lang="scss">
.index-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
