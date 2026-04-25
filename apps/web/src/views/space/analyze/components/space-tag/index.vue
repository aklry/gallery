<script setup lang="ts">
import { useSpaceTag } from './hooks'
import { ISpaceTagProps } from './types'
import DataAnalyze from '@/components/data-analyze/index.vue'

const props = defineProps<ISpaceTagProps>()
const { options, loading } = useSpaceTag(props)
</script>
<template>
    <div class="space-tag">
        <data-analyze :title="title" :loading="loading" :options="options" />
    </div>
</template>
<style scoped lang="scss"></style>
