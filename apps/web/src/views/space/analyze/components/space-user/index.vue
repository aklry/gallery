<script setup lang="ts">
import { useSpaceUser } from './hooks'
import { ISpaceUserProps } from './types'
import DataAnalyze from '@/components/data-analyze/index.vue'
import VueCharts from 'vue-echarts'
import 'echarts'

const props = defineProps<ISpaceUserProps>()
const { options, loading, timeDimension, timeDimensionOptions, userId } = useSpaceUser(props)
</script>
<template>
    <div class="index-container">
        <data-analyze :options="options" :loading="loading">
            <a-card title="用户上传分析">
                <vue-charts :option="options" :loading="loading" class="h-[320px] max-w-full" />
                <template #extra>
                    <a-space>
                        <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
                        <a-input-search v-model:value="userId" placeholder="请输入用户ID" />
                    </a-space>
                </template>
            </a-card>
        </data-analyze>
    </div>
</template>
<style scoped lang="scss">
.index-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
