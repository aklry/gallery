<script setup lang="ts">
import { useQueryFormHooks } from './hooks'
import { QueryFormPropsType } from './types'
import { SearchOutlined, FilterOutlined, UndoOutlined } from '@ant-design/icons-vue'

const props = defineProps<QueryFormPropsType>()
const {
    searchParams,
    tag_category,
    dateRange,
    rangePresets,
    doSearch,
    doReset,
    handlePureColorChange,
    filterVisible,
    toggleFilter
} = useQueryFormHooks(props)
</script>

<template>
    <div class="query-form">
        <!-- 搜索栏（始终可见） -->
        <div class="query-form__search-bar">
            <a-input-search
                v-model:value="searchParams.searchText"
                placeholder="从名称或者简介中搜索"
                enter-button="搜索"
                size="middle"
                @search="doSearch(searchParams)"
            />
            <a-button class="filter-toggle" :type="filterVisible ? 'primary' : 'default'" @click="toggleFilter">
                <FilterOutlined />
                筛选
            </a-button>
        </div>

        <!-- 筛选面板（可折叠） -->
        <transition name="filter-panel">
            <div v-show="filterVisible" class="query-form__filter-panel">
                <a-form :model="searchParams" layout="vertical" @finish="doSearch" ref="formRef">
                    <div class="filter-grid">
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
                    </div>
                    <a-collapse :bordered="false" class="advanced-collapse">
                        <a-collapse-panel key="1" header="更多搜索项">
                            <div class="filter-grid">
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
                                    <a-input-number
                                        v-model:value="searchParams.picWidth"
                                        placeholder="请输入图片宽度"
                                    />
                                </a-form-item>
                                <a-form-item label="高度" name="picHeight">
                                    <a-input-number
                                        v-model:value="searchParams.picHeight"
                                        placeholder="请输入图片高度"
                                    />
                                </a-form-item>
                                <a-form-item label="格式" name="picFormat">
                                    <a-input v-model:value="searchParams.picFormat" placeholder="请输入图片格式" />
                                </a-form-item>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                    <div class="filter-actions">
                        <a-button type="primary" html-type="submit">
                            <SearchOutlined />
                            搜索
                        </a-button>
                        <a-button html-type="reset" @click="doReset">
                            <UndoOutlined />
                            重置
                        </a-button>
                    </div>
                </a-form>
            </div>
        </transition>
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
