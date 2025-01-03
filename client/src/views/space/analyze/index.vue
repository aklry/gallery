<script setup lang="ts">
import { useSpaceAnalyzeHooks } from './hooks'
import SpaceUsage from './components/space-usage/index.vue'
import SpaceCategory from './components/space-category/index.vue'
import SpaceTag from './components/space-tag/index.vue'
import SpaceSize from './components/space-size/index.vue'
import SpaceUser from './components/space-user/index.vue'
import SpaceRank from './components/space-rank/index.vue'

const { spaceId, queryAll, queryPublic } = useSpaceAnalyzeHooks()
</script>

<template>
    <div class="space-analyze">
        <h2>
            空间图库分析-
            <span v-if="queryAll">全部空间</span>
            <span v-else-if="queryPublic">公共图库</span>
            <span v-else>
                <router-link :to="`/space/${spaceId}`">空间id:{{ spaceId }}</router-link>
            </span>
        </h2>
        <a-row :gutter="[16, 16]">
            <a-col :xs="24" :md="12">
                <space-usage :queryAll="queryAll" :queryPublic="queryPublic" :spaceId="spaceId" />
            </a-col>
            <a-col :xs="24" :md="12">
                <space-category
                    title="空间分类分析"
                    :queryAll="queryAll"
                    :queryPublic="queryPublic"
                    :spaceId="spaceId"
                />
            </a-col>
            <a-col :xs="24" :md="12">
                <space-tag title="图库标签词云" :queryAll="queryAll" :queryPublic="queryPublic" :spaceId="spaceId" />
            </a-col>
            <a-col :xs="24" :md="12">
                <space-size title="图片大小分布" :queryAll="queryAll" :queryPublic="queryPublic" :spaceId="spaceId" />
            </a-col>
            <a-col :xs="24" :md="12">
                <space-user :queryAll="queryAll" :queryPublic="queryPublic" :spaceId="spaceId" />
            </a-col>
            <a-col :xs="24" :md="12">
                <space-rank title="空间排行" />
            </a-col>
        </a-row>
    </div>
</template>

<style scoped lang="scss">
@use './css/index' as *;
</style>
