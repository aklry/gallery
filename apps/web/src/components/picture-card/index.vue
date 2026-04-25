<script setup lang="ts">
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import { PictureCardEmits, PictureCardProps } from './types'

const props = withDefaults(defineProps<PictureCardProps>(), {
    showEditAction: true,
    showDeleteAction: true
})
const emit = defineEmits<PictureCardEmits>()
const showActionBar = computed(() => props.showEditAction || props.showDeleteAction)

const handlePreviewPicture = (id: string, e?: MouseEvent) => {
    e?.stopPropagation()
    emit('previewPicture', id)
}

const handleDeletePrivatePicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('deletePicture', id)
}
const handleEditPicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('editPicture', id)
}
</script>
<template>
    <div class="picture-card-grid">
        <a-list
            :data-source="picture"
            :loading="loading"
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }"
        >
            <template #renderItem="{ item: picture }: { item: API.ShowPictureModelVo }">
                <a-list-item>
                    <div class="pic-card" @click="handlePreviewPicture(picture.id)">
                        <div class="pic-card__cover">
                            <img :src="picture.thumbnailUrl || picture.url" :alt="picture.filename" />
                            <div class="pic-card__overlay">
                                <a-button
                                    type="text"
                                    class="overlay-btn"
                                    @click="(e: MouseEvent) => handlePreviewPicture(picture.id, e)"
                                >
                                    <EyeOutlined />
                                </a-button>
                                <template v-if="showActionBar">
                                    <a-button
                                        v-if="showEditAction"
                                        type="text"
                                        class="overlay-btn"
                                        @click="(e: MouseEvent) => handleEditPicture(picture.id, e)"
                                    >
                                        <EditOutlined />
                                    </a-button>
                                    <a-button
                                        v-if="showDeleteAction"
                                        type="text"
                                        class="overlay-btn overlay-btn--danger"
                                        @click="(e: MouseEvent) => handleDeletePrivatePicture(picture.id, e)"
                                    >
                                        <DeleteOutlined />
                                    </a-button>
                                </template>
                            </div>
                        </div>
                        <div class="pic-card__body">
                            <div class="pic-card__title">{{ picture.filename }}</div>
                            <div class="pic-card__tags">
                                <span class="pic-tag pic-tag--category">{{ picture.category || '默认' }}</span>
                                <span class="pic-tag" v-for="tag in picture.tags.slice(0, 2)" :key="tag">{{
                                    tag
                                }}</span>
                            </div>
                        </div>
                    </div>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>
<style scoped lang="scss">
.picture-card-grid {
    :deep(.ant-list-item) {
        padding: 0;
    }
}

.pic-card {
    @apply rounded-xl overflow-hidden cursor-pointer;

    background: #fff;
    border: 1px solid #f0f0f0;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgb(99 102 241 / 12%);
        border-color: rgb(99 102 241 / 20%);
    }

    &__cover {
        @apply relative overflow-hidden;

        height: 180px;

        img {
            @apply w-full h-full block;

            object-fit: cover;
            transition: transform 0.35s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    &__overlay {
        @apply absolute inset-0 flex items-center justify-center gap-2;

        background: rgb(0 0 0 / 45%);
        opacity: 0;
        transition: opacity 0.25s ease;

        .pic-card:hover & {
            opacity: 1;
        }
    }

    &__body {
        @apply px-3 py-2.5;
    }

    &__title {
        @apply text-sm font-medium truncate;

        color: #1a1a2e;
        line-height: 1.5;
    }

    &__tags {
        @apply flex flex-wrap gap-1.5 mt-1.5;
    }
}

.overlay-btn {
    @apply rounded-full;

    width: 36px;
    height: 36px;
    color: #fff;
    background: rgb(255 255 255 / 15%);
    backdrop-filter: blur(4px);
    border: 1px solid rgb(255 255 255 / 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        background 0.2s ease,
        transform 0.2s ease;

    &:hover {
        background: rgb(255 255 255 / 30%);
        color: #fff !important;
        transform: scale(1.1);
    }

    &--danger:hover {
        background: rgb(239 68 68 / 70%);
    }
}

.pic-tag {
    @apply text-xs px-2 py-0.5 rounded-full;

    background: #f0f0f5;
    color: #64748b;

    &--category {
        background: #e6f7e6;
        color: #389e0d;
    }
}
</style>
