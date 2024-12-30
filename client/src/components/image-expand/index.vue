<script setup lang="ts">
import { ImageExpandProps } from './types'
import { useImageExpand } from './hooks'

const visible = defineModel('visible', {
    type: Boolean,
    default: false
})
const props = defineProps<ImageExpandProps>()
const { resultImageUrl, handleGenerate, loading, handleApply } = useImageExpand(props)
</script>
<template>
    <div class="image-expand">
        <a-modal v-model:open="visible" title="AI扩图" :footer="false" width="600px" class="max-h-[500px]">
            <a-row :gutter="16">
                <a-col :span="12">
                    <h4>原始图片</h4>
                    <img :src="picture?.url" class="max-w-full" />
                </a-col>
                <a-col :span="12">
                    <h4>扩图结果</h4>
                    <img :src="resultImageUrl" v-if="resultImageUrl" :alt="picture?.filename" class="max-w-full" />
                </a-col>
            </a-row>
            <div class="mb-4" />
            <a-flex :gap="16" justify="center">
                <a-button type="primary" :loading="loading" ghost @click="handleGenerate">生成图片</a-button>
                <a-button type="primary" ghost @click="handleApply">应用结果</a-button>
            </a-flex>
        </a-modal>
    </div>
</template>
<style scoped lang="scss"></style>
