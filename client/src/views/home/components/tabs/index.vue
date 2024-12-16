<template>
    <a-tabs v-model:activeKey="activeKey" @change="changeTabs">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane v-for="item in tag_category.categoryList" :key="item.value" :tab="item.value" />
    </a-tabs>
</template>
<script setup lang="ts">
import { TagCategory } from '@/store/modules/picture/type'
import { ref } from 'vue'
defineProps<{
    tag_category: TagCategory
}>()
const emit = defineEmits(['changeTabs'])
const activeKey = ref('all')
const changeTabs = (key: string) => {
    emit('changeTabs', key)
}
</script>

<style scoped lang="scss">
.ant-tabs {
    @apply pl-5;
}
</style>
