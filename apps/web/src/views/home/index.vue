<script setup lang="ts">
import { DownloadOutlined, EyeOutlined, LikeOutlined, LoadingOutlined, StarOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import usePictureStore from '@/store/modules/picture'
import TagBars from './components/tag-bars/index.vue'
import Tabs from './components/tabs/index.vue'
import { resolveHomeDisplayState } from './display-state'
import useHomeHooks from './hooks'

const pictureStore = usePictureStore()
const { tag_category, tag_category_loaded } = storeToRefs(pictureStore)
const containerRef = ref<HTMLDivElement | null>(null)
const sentinelRef = ref<HTMLDivElement | null>(null)
const startupMaskVisible = ref(true)
const {
    dataList,
    changeTabs,
    changeTags,
    clickPicture,
    handleSearchPicture,
    searchParams,
    loading,
    noMore,
    initializeHomeFeed
} = useHomeHooks(containerRef, sentinelRef)

const displayState = computed(() =>
    resolveHomeDisplayState({
        loading: loading.value,
        hasData: dataList.value.length > 0
    })
)

const runStartupTasks = async () => {
    const startupTasks = [initializeHomeFeed()]

    if (!tag_category_loaded.value) {
        startupTasks.push(pictureStore.getTagCategory())
    }

    try {
        await Promise.allSettled(startupTasks)
    } finally {
        startupMaskVisible.value = false
    }
}

onMounted(() => {
    void runStartupTasks()
})

const handleMouseMove = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLElement
    if (!card) return

    requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const xPct = (x / rect.width - 0.5) * 2
        const yPct = (y / rect.height - 0.5) * 2
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
        <div v-if="startupMaskVisible" class="home-startup-mask">
            <div class="home-startup-mask__halo home-startup-mask__halo--left"></div>
            <div class="home-startup-mask__halo home-startup-mask__halo--right"></div>
            <div class="home-startup-mask__card">
                <div class="home-startup-mask__spinner"></div>
                <p class="home-startup-mask__title">正在准备首页内容</p>
                <p class="home-startup-mask__subtitle">精选图片和标签分类加载完成后会立即展示</p>
            </div>
        </div>

        <div class="search-hero">
            <h1 class="hero-title"><span class="gradient-text">探索</span>与发现海量灵感</h1>
            <p class="hero-subtitle">在这里找到高质量图片内容，激发你的下一次创作</p>
            <div class="input-search-wrapper">
                <a-input-search
                    v-model:value="searchParams.searchText"
                    class="custom-search"
                    placeholder="例如：风景、人物、赛博朋克..."
                    size="large"
                    enterButton="搜索"
                    @search="handleSearchPicture"
                />
            </div>
        </div>

        <div class="main-content">
            <tabs :tag_category="tag_category" @changeTabs="changeTabs" />
            <tag-bars :tag_category="tag_category" @changeTags="changeTags" />

            <template v-if="displayState === 'content'">
                <Waterfall
                    :list="dataList"
                    :width="300"
                    :loadProps="{
                        loading: '/loading.gif'
                    }"
                >
                    <template #default="{ item }: { item: API.ShowPictureModelVo }">
                        <div
                            class="picture-card"
                            @click="clickPicture(item.id)"
                            @mousemove="handleMouseMove"
                            @mouseleave="handleMouseLeave"
                        >
                            <div class="picture-card__cover">
                                <LazyImg :url="item.thumbnailUrl" />
                                <div class="picture-card__overlay">
                                    <div class="overlay-bottom">
                                        <div class="main-info">
                                            <span class="category">{{ item.category || '默认' }}</span>
                                        </div>
                                        <div class="stats-row">
                                            <div class="stat-item" title="点赞">
                                                <LikeOutlined />
                                                <span>{{ item.likeNumber ?? 0 }}</span>
                                            </div>
                                            <div class="stat-item" title="收藏">
                                                <StarOutlined />
                                                <span>{{ item.collectionNumber ?? 0 }}</span>
                                            </div>
                                            <div class="stat-item" title="浏览">
                                                <EyeOutlined />
                                                <span>{{ item.viewNumber ?? 0 }}</span>
                                            </div>
                                            <div class="stat-item" title="下载">
                                                <DownloadOutlined />
                                                <span>{{ item.downloadNumber ?? 0 }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Waterfall>

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
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
