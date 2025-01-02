<script setup lang="ts">
import { formatSize } from '@/utils'
import DataAnalyze from '@/components/data-analyze/index.vue'
import { useSpaceAnalyze } from './hooks'
import { ISpaceAnaLyzeProps } from '../types'

const props = defineProps<ISpaceAnaLyzeProps>()
const { spaceUsageData } = useSpaceAnalyze(props)
</script>

<template>
    <div class="space-analyze">
        <data-analyze>
            <a-flex gap="middle">
                <a-card title="存储空间" class="w-1/2">
                    <div class="h-[320px] text-center">
                        <h3>
                            {{ formatSize(spaceUsageData?.usedSize) }} /
                            {{ spaceUsageData?.maxSize ? formatSize(spaceUsageData?.maxSize) : '无限制' }}
                        </h3>
                        <a-progress type="dashboard" :percent="spaceUsageData?.sizeUsageRatio ?? 0" />
                    </div>
                </a-card>
                <a-card title="图片数量" class="w-1/2">
                    <div class="h-[320px] text-center">
                        <h3>
                            {{ spaceUsageData?.usedCount }} /
                            {{ spaceUsageData?.usedCount ? spaceUsageData?.maxCount : '无限制' }}
                        </h3>
                        <a-progress type="dashboard" :percent="spaceUsageData?.countUsageRatio ?? 0" />
                    </div>
                </a-card>
            </a-flex>
        </data-analyze>
    </div>
</template>

<style scoped lang="scss"></style>
