<script setup lang="ts">
import { useDataAnalyze } from './hooks'
import { IDataAnalyzeProps } from './types'
import VueCharts from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'

const props = withDefaults(defineProps<IDataAnalyzeProps>(), {
    loading: false
})
useDataAnalyze(props)
</script>

<template>
    <div class="data-analyze">
        <slot>
            <a-card :title="title" :bordered="false">
                <vue-charts :option="options" :loading="loading" class="h-[320px] max-w-full" />
            </a-card>
        </slot>
    </div>
</template>

<style scoped lang="scss"></style>
