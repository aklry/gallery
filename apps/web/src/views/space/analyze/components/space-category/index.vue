<script setup lang="ts">
import { useSpaceCategory } from './hooks'
import { ISpaceCategoryProps } from './types'
import DataAnalyze from '@/components/data-analyze/index.vue'

const props = defineProps<ISpaceCategoryProps>()
const { options } = useSpaceCategory(props)
</script>

<template>
    <div class="space-category">
        <data-analyze :title="title" :options="options" />
    </div>
</template>

<style scoped lang="scss"></style>
