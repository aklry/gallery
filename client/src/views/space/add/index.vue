<script setup lang="ts">
import { formatSize } from '@/utils'
import { useAddSpace } from './hooks'
import { SpaceLevelOptions } from '@/constants'

const { form, handleCreateSpace, loading, spaceLevelList } = useAddSpace()
</script>
<template>
    <div class="add-space">
        <a-card title="创建空间">
            <a-form :model="form" layout="vertical" @finish="handleCreateSpace">
                <a-form-item label="空间名称" name="spaceName">
                    <a-input v-model:value="form.spaceName" />
                </a-form-item>
                <a-form-item label="空间等级" name="spaceLevel">
                    <a-select v-model:value="form.spaceLevel" :options="SpaceLevelOptions" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" htmlType="submit" :loading="loading" block>创建</a-button>
                </a-form-item>
            </a-form>
            <a-card title="空间级别介绍" class="mt-10">
                <a-typography-paragraph>
                    *
                    目前空间等级分为免费、基础、高级三种，免费空间为100MB，基础空间为1000MB，高级空间为10000MB，目前仅支持开通免费版，如需升级，请联系客服
                </a-typography-paragraph>
                <a-typography-paragraph v-for="level in spaceLevelList" :key="level.text">
                    <p>{{ level.text }}:大小{{ formatSize(level.maxSize) }},数量:{{ level.maxCount }}</p>
                </a-typography-paragraph>
            </a-card>
        </a-card>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;
</style>
