<script setup lang="ts">
import useHomeHooks from './hooks'
import Tabs from './components/tabs/index.vue'
import { storeToRefs } from 'pinia'
import usePictureStore from '@/store/modules/picture'
import TagBars from './components/tag-bars/index.vue'
import PictureDetailModal from '@/components/picture-detail-modal/index.vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ref } from 'vue'

const pictureStore = usePictureStore()
const { tag_category } = storeToRefs(pictureStore)
const containerRef = ref<HTMLDivElement | null>(null)
const {
    dataList,
    changeTabs,
    changeTags,
    clickPicture,
    handleSearchPicture,
    searchParams,
    detailVisible,
    detailPicture,
    detailLoading
} = useHomeHooks(containerRef)
</script>
<template>
    <div class="home h-full overflow-scroll" ref="containerRef">
        <!-- Modern Hero Search Section -->
        <div class="search-hero">
            <h1 class="hero-title"><span class="gradient-text">探索</span>与发现海量灵感</h1>
            <p class="hero-subtitle">在这里找到高品质的图片内容，激发你的下一次创作</p>
            <div class="input-search-wrapper">
                <a-input-search
                    class="custom-search"
                    placeholder="例如：风景，人像，赛博朋克..."
                    size="large"
                    enterButton="搜索"
                    @search="handleSearchPicture"
                    v-model:value="searchParams.searchText"
                />
            </div>
        </div>

        <div class="main-content">
            <tabs :tag_category="tag_category" @changeTabs="changeTabs" />
            <tag-bars :tag_category="tag_category" @changeTags="changeTags" />
            <template v-if="dataList.length > 0">
                <Waterfall :list="dataList" :width="230">
                    <!-- 新版插槽数据获取 -->
                    <template #default="{ item }">
                        <div class="picture-card" @click="clickPicture(item.id)">
                            <div class="picture-card__cover">
                                <LazyImg :url="item.url" />
                                <!-- Hover Overlay -->
                                <div class="picture-card__overlay">
                                    <div class="zoom-icon"><i class="ri-zoom-in-line"></i></div>
                                </div>
                            </div>
                            <div class="picture-card__body">
                                <div class="picture-card__title">{{ item.filename }}</div>
                                <div class="picture-card__tags">
                                    <span class="tag tag--category">{{ item.category || '默认' }}</span>
                                    <span class="tag" v-for="tag in item.tags.slice(0, 2)" :key="tag">{{ tag }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </Waterfall>
            </template>
            <template v-else>
                <a-empty description="暂无数据" class="mt-20" />
            </template>
        </div>
        <PictureDetailModal v-model:visible="detailVisible" :picture="detailPicture" :loading="detailLoading" />
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
