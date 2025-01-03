<script setup lang="ts">
import { useSpaceRankAnalyzeHooks } from './hooks'
import DataAnalyze from '@/components/data-analyze/index.vue'
import { ISpaceRankProps } from './types'

const { loading, options } = useSpaceRankAnalyzeHooks()
defineProps<ISpaceRankProps>()
</script>
<template>
    <div class="space-rank">
        <data-analyze :loading="loading" :options="options" :title="title" />
    </div>
</template>
<style scoped lang="scss"></style>
