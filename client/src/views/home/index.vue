<script setup lang="ts">
import useHomeHooks from './hooks'
import Tabs from './components/tabs/index.vue'
import { storeToRefs } from 'pinia'
import usePictureStore from '@/store/modules/picture'
import TagBars from './components/tag-bars/index.vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const pictureStore = usePictureStore()
const { tag_category } = storeToRefs(pictureStore)
const { dataList, changeTabs, changeTags, clickPicture, handleSearchPicture, searchParams, containerRef } =
    useHomeHooks()
</script>
<template>
    <div class="home h-full overflow-scroll" ref="containerRef">
        <div class="input-search">
            <a-input-search
                placeholder="从海量图片中搜索"
                size="middle"
                enterButton="搜索"
                @search="handleSearchPicture"
                v-model:value="searchParams.searchText"
            />
        </div>
        <tabs :tag_category="tag_category" @changeTabs="changeTabs" />
        <tag-bars :tag_category="tag_category" @changeTags="changeTags" />
        <template v-if="dataList.length > 0">
            <Waterfall :list="dataList" :width="230">
                <!-- 新版插槽数据获取 -->
                <template #default="{ item }">
                    <a-card @click="clickPicture(item.id)">
                        <template #cover>
                            <LazyImg :url="item.url" />
                        </template>
                        <a-card-meta :title="item.filename">
                            <template #description>
                                <a-flex>
                                    <a-tag color="success">{{ item.category || '默认' }}</a-tag>
                                    <a-tag v-for="tag in item.tags.slice(0, 2)" :key="tag">{{ tag }}</a-tag>
                                </a-flex>
                            </template>
                        </a-card-meta>
                    </a-card>
                </template>
            </Waterfall>
        </template>
        <template v-else>
            <a-empty description="暂无数据" />
        </template>
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
