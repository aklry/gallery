<script setup lang="ts">
import { useQueryFormHooks } from './hooks'
import { QueryFormPropsType } from './types'

const props = defineProps<QueryFormPropsType>()
const { searchParams, tag_category, dateRange, rangePresets, doSearch, doReset, handlePureColorChange } =
    useQueryFormHooks(props)
</script>

<template>
    <div class="query-form">
        <a-form :model="searchParams" layout="vertical" @finish="doSearch" ref="formRef">
            <a-form-item label="关键词" name="searchText">
                <a-input v-model:value="searchParams.searchText" placeholder="从名称或者简介中搜索" />
            </a-form-item>
            <a-form-item label="分类" name="category">
                <a-auto-complete
                    v-model:value="searchParams.category"
                    :options="tag_category?.categoryList"
                    placeholder="请选择图片分类"
                />
            </a-form-item>
            <a-form-item label="标签" name="tags">
                <a-select
                    v-model:value="searchParams.tags"
                    mode="multiple"
                    :options="tag_category?.tagList"
                    placeholder="请选择图片标签"
                />
            </a-form-item>
            <a-form-item label="名称" name="name">
                <a-input v-model:value="searchParams.name" placeholder="请输入图片名称" />
            </a-form-item>
            <a-form-item label="简介" name="introduction">
                <a-input v-model:value="searchParams.introduction" placeholder="请输入图片简介" />
            </a-form-item>
            <a-form-item label="按颜色搜索" class="color-search">
                <color-picker format="hex" @pureColorChange="handlePureColorChange" />
            </a-form-item>
            <a-form-item class="more">
                <a-collapse>
                    <a-collapse-panel key="1" header="更多搜索项">
                        <a-form-item label="日期">
                            <a-range-picker
                                v-model:value="dateRange"
                                :presets="rangePresets"
                                :placeholder="['开始编辑时间', '结束编辑时间']"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </a-form-item>
                        <a-form-item label="宽度" name="picWidth">
                            <a-input-number v-model:value="searchParams.picWidth" placeholder="请输入图片宽度" />
                        </a-form-item>
                        <a-form-item label="高度" name="picHeight">
                            <a-input-number v-model:value="searchParams.picHeight" placeholder="请输入图片高度" />
                        </a-form-item>
                        <a-form-item label="格式" name="picFormat">
                            <a-input v-model:value="searchParams.picFormat" placeholder="请输入图片格式" />
                        </a-form-item>
                    </a-collapse-panel>
                </a-collapse>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" class="mr-2" html-type="submit">搜索</a-button>
                <a-button type="primary" html-type="reset" @click="doReset">重置</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
