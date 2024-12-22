<template>
    <div class="home h-full overflow-scroll" v-load:[++current].loaded="fetchData">
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
        <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :data-source="dataList">
            <template #renderItem="{ item: picture }: { item: API.ShowPictureModelVo }">
                <a-list-item>
                    <a-card @click="clickPicture(picture.id)">
                        <template #cover>
                            <img
                                :src="picture.thumbnailUrl ?? picture.url"
                                :alt="picture.filename"
                                style="height: 180px; object-fit: cover"
                            />
                        </template>
                        <a-card-meta :title="picture.filename">
                            <template #description>
                                <a-flex>
                                    <a-tag color="success">{{ picture.category || '默认' }}</a-tag>
                                    <a-tag v-for="tag in picture.tags.slice(0, 2)" :key="tag">{{ tag }}</a-tag>
                                </a-flex>
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup lang="ts">
import useHomeHooks from './hooks'
import Tabs from './components/tabs/index.vue'
import { storeToRefs } from 'pinia'
import usePictureStore from '@/store/modules/picture'
import TagBars from './components/tag-bars/index.vue'
const pictureStore = usePictureStore()
const { tag_category } = storeToRefs(pictureStore)
const { dataList, changeTabs, changeTags, clickPicture, handleSearchPicture, searchParams, fetchData, current } =
    useHomeHooks()
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
