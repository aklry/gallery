<script setup lang="ts">
import { formatTime, formatSize, toHexColor, downloadPicture } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{
    visible: boolean
    picture: API.GetPictureVoModel | null
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
}>()

const open = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
})
</script>
<template>
    <a-modal v-model:open="open" :footer="null" :width="860" :bodyStyle="{ padding: '16px' }" destroyOnClose>
        <a-spin :spinning="loading">
            <template v-if="picture">
                <div class="detail-modal">
                    <div class="detail-modal__preview">
                        <a-image :src="picture.url" :alt="picture.name" class="detail-modal__img" />
                    </div>
                    <div class="detail-modal__info">
                        <h3 class="detail-modal__name">{{ picture.name }}</h3>
                        <p class="detail-modal__intro" v-if="picture.introduction">{{ picture.introduction }}</p>

                        <div class="detail-modal__author">
                            <a-avatar :size="28" :src="picture.user?.userAvatar" />
                            <span>{{ picture.user?.userName ?? '佚名' }}</span>
                        </div>

                        <a-divider style="margin: 12px 0" />

                        <div class="detail-modal__meta">
                            <div class="meta-item">
                                <span class="meta-label">分类</span>
                                <span class="meta-value">{{ picture.category || '默认' }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">格式</span>
                                <span class="meta-value">{{ picture.picFormat }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">尺寸</span>
                                <span class="meta-value">{{ picture.picWidth }} × {{ picture.picHeight }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">大小</span>
                                <span class="meta-value">{{ formatSize(picture.picSize) }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">宽高比</span>
                                <span class="meta-value">{{ picture.picScale }}</span>
                            </div>
                            <div class="meta-item" v-if="picture.picColor">
                                <span class="meta-label">主色调</span>
                                <span class="meta-value">
                                    <span
                                        class="color-dot"
                                        :style="{ backgroundColor: toHexColor(picture.picColor) }"
                                    />
                                    {{ toHexColor(picture.picColor) }}
                                </span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">上传时间</span>
                                <span class="meta-value">{{ formatTime(picture.createTime) }}</span>
                            </div>
                        </div>

                        <div class="detail-modal__tags" v-if="picture.tags?.length">
                            <a-tag v-for="tag in picture.tags" :key="tag" color="blue">{{ tag }}</a-tag>
                        </div>

                        <div class="detail-modal__actions">
                            <a-button type="primary" @click="downloadPicture(picture.url, picture.name)">
                                下载图片
                            </a-button>
                        </div>
                    </div>
                </div>
            </template>
        </a-spin>
    </a-modal>
</template>

<style scoped lang="scss">
.detail-modal {
    @apply flex gap-4;

    &__preview {
        @apply flex-1 min-w-0 flex items-center justify-center;

        background: #fafafa;
        border-radius: 8px;
        overflow: hidden;
        min-height: 300px;
        max-height: 500px;
    }

    &__img {
        max-width: 100%;
        max-height: 500px;
        object-fit: contain;
    }

    &__info {
        @apply flex flex-col;

        width: 280px;
        flex-shrink: 0;
    }

    &__name {
        @apply text-lg font-semibold m-0;

        color: #1a1a1a;
    }

    &__intro {
        @apply text-sm mt-1 mb-0;

        color: #8c8c8c;
    }

    &__author {
        @apply flex items-center gap-2 mt-3 text-sm;

        color: #595959;
    }

    &__meta {
        @apply flex flex-col gap-2;

        .meta-item {
            @apply flex justify-between text-sm;
        }

        .meta-label {
            color: #8c8c8c;
        }

        .meta-value {
            @apply flex items-center gap-1;

            color: #1a1a1a;
        }

        .color-dot {
            @apply inline-block w-3 h-3 rounded-full;

            border: 1px solid #e8e8e8;
        }
    }

    &__tags {
        @apply flex flex-wrap gap-1.5 mt-3;
    }

    &__actions {
        @apply mt-auto pt-4;
    }
}

@media (width <= 640px) {
    .detail-modal {
        @apply flex-col;

        &__info {
            width: 100%;
        }
    }
}
</style>
