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
import { LoadingOutlined } from '@ant-design/icons-vue'
import { formatSize, toHexColor } from '@/utils'

const pictureStore = usePictureStore()
const { tag_category } = storeToRefs(pictureStore)
const containerRef = ref<HTMLDivElement | null>(null)
const sentinelRef = ref<HTMLDivElement | null>(null)
const {
    dataList,
    changeTabs,
    changeTags,
    clickPicture,
    handleSearchPicture,
    searchParams,
    loading,
    noMore,
    detailVisible,
    detailPicture,
    detailLoading
} = useHomeHooks(containerRef, sentinelRef)

// 3D Parallax Hover Effect
const handleMouseMove = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLElement
    if (!card) return
    // Request animation frame to throttle calculation and rendering for performance
    requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        // Normalize mouse coordinates from -1 to 1 based on card center
        const xPct = (x / rect.width - 0.5) * 2
        const yPct = (y / rect.height - 0.5) * 2
        // Tilt intensity limit (degrees)
        const intensity = 10
        const rotateX = yPct * -intensity
        const rotateY = xPct * intensity
        card.style.setProperty('--rx', `${rotateX}deg`)
        card.style.setProperty('--ry', `${rotateY}deg`)
    })
}

const handleMouseLeave = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLElement
    if (!card) return
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
}
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
                <Waterfall
                    :list="dataList"
                    :width="300"
                    :loadProps="{
                        loading: '/loading.gif'
                    }"
                >
                    <!-- 新版插槽数据获取 -->
                    <template #default="{ item }">
                        <div
                            class="picture-card"
                            @click="clickPicture(item.id)"
                            @mousemove="handleMouseMove"
                            @mouseleave="handleMouseLeave"
                        >
                            <div class="picture-card__cover">
                                <LazyImg :url="item.url" />
                                <!-- 遮罩层 -->
                                <div class="picture-card__overlay">
                                    <div class="overlay-content">
                                        <div class="info-row">
                                            <div class="info-item">
                                                <span class="label">格式:</span>
                                                <span class="value">{{
                                                    (item.picFormat || item.format || '未知').toUpperCase()
                                                }}</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="label">大小:</span>
                                                <span class="value">{{
                                                    formatSize(item.picSize || item.fileSize)
                                                }}</span>
                                            </div>
                                        </div>
                                        <div class="info-row">
                                            <div class="info-item">
                                                <span class="label">分辨率:</span>
                                                <span class="value"
                                                    >{{ item.picWidth || item.width || 0 }}x{{
                                                        item.picHeight || item.height || 0
                                                    }}</span
                                                >
                                            </div>
                                            <div class="info-item">
                                                <span class="label">分类:</span>
                                                <span class="value">{{ item.category ?? '默认' }}</span>
                                            </div>
                                        </div>
                                        <div class="info-row" v-if="item.picColor || item.color">
                                            <div class="info-item">
                                                <span class="label">主色调:</span>
                                                <span
                                                    class="color-block"
                                                    :style="{
                                                        backgroundColor: toHexColor(item.picColor || item.color)
                                                    }"
                                                ></span>
                                                <span class="value">{{
                                                    toHexColor(item.picColor || item.color)?.toUpperCase()
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Waterfall>
                <!-- 底部加载状态 -->
                <div ref="sentinelRef" class="load-more-sentinel">
                    <div v-if="loading" class="load-more-indicator">
                        <LoadingOutlined class="load-more-icon" />
                        <span>加载中...</span>
                    </div>
                    <div v-else-if="noMore" class="load-more-indicator load-more-end">
                        <span>没有更多图片了</span>
                    </div>
                </div>
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
