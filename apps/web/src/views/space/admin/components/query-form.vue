<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { QueryFormProps } from './type'
import { SpaceLevelEnum, SpaceLevelOptions } from '@/constants'

const props = defineProps<QueryFormProps>()
const searchParams = reactive<API.QuerySpaceDto>({
    spaceName: '',
    current: '1',
    pageSize: '10',
    spaceLevel: SpaceLevelEnum.FREE
})
watchEffect(() => {
    if (props.searchParams) {
        searchParams.spaceName = props.searchParams.spaceName
        searchParams.spaceLevel = props.searchParams.spaceLevel || SpaceLevelEnum.FREE
    }
})
const handleQuery = () => {
    props.query?.(searchParams)
}
</script>
<template>
    <div class="query-form mb-4">
        <a-form :model="searchParams" layout="inline" @finish="handleQuery">
            <a-form-item label="空间名称" name="spaceName">
                <a-input v-model:value="searchParams.spaceName" />
            </a-form-item>
            <a-form-item label="空间等级" name="spaceLevel">
                <a-select v-model:value="searchParams.spaceLevel" :options="SpaceLevelOptions" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">查询</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<style scoped lang="scss">
.query-form-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
