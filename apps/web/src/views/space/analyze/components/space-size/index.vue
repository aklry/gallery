<script setup lang="ts">
import { useSpaceSize } from './hooks'
import DataAnalyze from '@/components/data-analyze/index.vue'
import { ISpaceSizeProps } from './types'

const props = defineProps<ISpaceSizeProps>()
const { loading, options } = useSpaceSize(props)
</script>
<template>
    <div class="space-size">
        <data-analyze :title="title" :options="options" :loading="loading" />
    </div>
</template>
<style scoped lang="scss"></style>
