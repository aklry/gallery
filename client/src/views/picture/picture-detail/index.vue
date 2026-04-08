<script setup lang="ts">
import PictureDetailContent from '@/components/picture-detail-content/index.vue'
import usePictureDetail from './hooks'

const props = defineProps<{
    id: string
}>()

const { picture, deletePicture, canEditOrDelete, editPicture, downloadPicture } = usePictureDetail(props.id)
</script>

<template>
    <div id="picture-detail-page" class="picture-detail">
        <a-row :gutter="[24, 24]">
            <a-col :sm="24" :md="16" :xl="18">
                <div class="image-preview-card">
                    <div class="image-container">
                        <div class="corner top-left"></div>
                        <div class="corner top-right"></div>
                        <div class="corner bottom-left"></div>
                        <div class="corner bottom-right"></div>

                        <a-image
                            width="100%"
                            height="100%"
                            :src="picture?.url"
                            :alt="picture?.name"
                            class="main-image"
                        />
                    </div>
                </div>
            </a-col>

            <a-col :sm="24" :md="8" :xl="6">
                <picture-detail-content
                    :picture="picture ?? null"
                    :can-edit="canEditOrDelete"
                    :can-delete="canEditOrDelete"
                    @download="downloadPicture(picture?.url, picture?.name)"
                    @edit="editPicture"
                    @delete="deletePicture"
                />
            </a-col>
        </a-row>
    </div>
</template>

<style scoped lang="scss">
@use './css/index.scss' as *;

.picture-detail {
    --preview-frame-width: 820px;
    --preview-frame-height: 540px;

    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;

    .image-preview-card {
        background: linear-gradient(180deg, rgb(255 255 255 / 96%) 0%, rgb(241 248 255 / 92%) 100%);
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 20px 48px rgb(148 163 184 / 20%);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 620px;

        .image-container {
            position: relative;
            width: var(--preview-frame-width);
            height: var(--preview-frame-height);
            max-width: 100%;
            padding: 16px;
            border-radius: 24px;
            background: linear-gradient(180deg, #eff7ff 0%, #f8fbff 100%);
            box-shadow:
                inset 0 1px 0 rgb(255 255 255 / 90%),
                0 14px 32px rgb(174 197 220 / 32%);

            .corner {
                position: absolute;
                width: 34px;
                height: 34px;
                border: 3px solid transparent;
                opacity: 0.78;
                z-index: 2;
            }

            .top-left {
                top: 14px;
                left: 14px;
                border-top-color: #b7c8dd;
                border-left-color: #b7c8dd;
                border-top-left-radius: 12px;
            }

            .top-right {
                top: 14px;
                right: 14px;
                border-top-color: #b7c8dd;
                border-right-color: #b7c8dd;
                border-top-right-radius: 12px;
            }

            .bottom-left {
                bottom: 14px;
                left: 14px;
                border-bottom-color: #b7c8dd;
                border-left-color: #b7c8dd;
                border-bottom-left-radius: 12px;
            }

            .bottom-right {
                bottom: 14px;
                right: 14px;
                border-bottom-color: #b7c8dd;
                border-right-color: #b7c8dd;
                border-bottom-right-radius: 12px;
            }

            :deep(.main-image) {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 18px;
                overflow: hidden;
                background: radial-gradient(circle at top, rgb(43 56 82 / 16%), rgb(15 23 42 / 4%));
            }

            :deep(.main-image .ant-image-img) {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 18px;
                background: rgb(226 236 248 / 55%);
            }

            :deep(.main-image .ant-image-mask) {
                border-radius: 18px;
            }
        }
    }

    @media (width <= 1200px) {
        --preview-frame-width: 100%;
        --preview-frame-height: 500px;

        .image-preview-card {
            min-height: 560px;
        }
    }

    @media (width <= 768px) {
        padding: 16px;

        --preview-frame-height: 360px;

        .image-preview-card {
            min-height: auto;
            padding: 12px;

            .image-container {
                padding: 12px;
            }
        }
    }
}
</style>
