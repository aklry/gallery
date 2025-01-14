<script lang="ts" setup>
import usePictureBatchHook from './hooks'

const { formState, handleSubmit, loading } = usePictureBatchHook()
</script>
<template>
    <div class="picture-batch">
        <a-card title="批量添加图片">
            <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="关键词" name="keywords">
                    <a-input v-model:value="formState.keywords" />
                </a-form-item>
                <a-form-item label="数量" name="count">
                    <a-input-number v-model:value="formState.count" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<style lang="scss" scoped>
@use './css' as *;
</style>
