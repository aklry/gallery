<script setup lang="ts">
import { ref } from 'vue'
import PictureDetailContent from '@/components/picture-detail-content/index.vue'
import usePictureDetail from './hooks'
import { EyeOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
    id: string
}>()

const { picture, deletePicture, canEditOrDelete, editPicture, downloadPicture, handleCollect } = usePictureDetail(
    props.id
)

const previewVisible = ref(false)
const isImageLoaded = ref(false)
</script>

<template>
    <div id="picture-detail-page" class="picture-detail">
        <a-row :gutter="[24, 24]">
            <a-col :sm="24" :md="16" :xl="18">
                <div class="image-preview-card">
                    <div class="image-container">
                        <div class="corner top-left" />
                        <div class="corner top-right" />
                        <div class="corner bottom-left" />
                        <div class="corner bottom-right" />
                        <div
                            class="relative w-full h-full group flex justify-center items-center overflow-hidden rounded-[18px] cursor-pointer bg-black/5"
                            @click="previewVisible = true"
                        >
                            <!-- 沉浸式毛玻璃背景垫底 -->
                            <div
                                v-if="picture?.url"
                                class="absolute inset-0 bg-cover bg-center scale-[1.15] blur-2xl pointer-events-none transition-opacity duration-500"
                                :class="isImageLoaded ? 'opacity-60' : 'opacity-0'"
                                :style="{ backgroundImage: `url(${picture.url})` }"
                            />

                            <!-- 图片骨架屏/加载动画 -->
                            <div
                                v-if="picture?.url && !isImageLoaded"
                                class="absolute inset-0 flex items-center justify-center z-10"
                            >
                                <a-spin size="large" />
                            </div>

                            <!-- 保证图片完整展示 (contain) 并在视觉上与背景拉开层次 -->
                            <img
                                v-show="picture?.url"
                                :src="picture?.url"
                                :alt="picture?.name"
                                @load="isImageLoaded = true"
                                :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                                class="object-contain w-full h-full transition-all duration-500 main-image group-hover:scale-105 relative z-10 drop-shadow-lg"
                                loading="lazy"
                            />

                            <!-- 遮罩层 (提高 z-index 确保盖在所有元素上方) -->
                            <div
                                class="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center justify-center z-20"
                            >
                                <div
                                    class="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white shadow-xl backdrop-blur-md border border-white/30 transform scale-95 group-hover:scale-100 transition-all duration-300"
                                >
                                    <EyeOutlined class="text-xl leading-none" />
                                    <span class="text-sm font-medium tracking-wide leading-none mt-[2px]">
                                        点击预览
                                    </span>
                                </div>
                            </div>
                        </div>
                        <a-image
                            :style="{ display: 'none' }"
                            :src="picture?.url"
                            :preview="{
                                visible: previewVisible,
                                onVisibleChange: (vis: boolean) => (previewVisible = vis)
                            }"
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
                    @collect="handleCollect"
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
            display: flex;
            justify-content: center;
            align-items: center;
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
