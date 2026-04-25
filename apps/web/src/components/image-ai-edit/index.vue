<script setup lang="ts">
import { RobotOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { ImageAiEditProps } from './types'
import { useImageAiEdit } from './hooks'

const visible = defineModel('visible', {
    type: Boolean,
    default: false
})

const props = defineProps<ImageAiEditProps>()

const { prompt, resultImages, selectedImageUrl, loading, applyLoading, handleGenerate, handleApply, setApplyLoading } =
    useImageAiEdit(props)

defineExpose({
    setApplyLoading
})

const presets = [
    { label: '动漫风格', value: '把这张图片变成动漫风格' },
    { label: '油画效果', value: '将这张图转换为印象派油画' },
    { label: '复古胶片', value: '赋予这张图复古胶片的质感和色调' },
    { label: '赛博朋克', value: '将图片转换为赛博朋克霓虹风格' },
    { label: '3D 渲染', value: '将图片转换为 3D 渲染的粘土人风格' },
    { label: '极简主义', value: '提取主体，背景设为纯色，呈现极简主义风格' }
]

const handlePresetClick = (val: string) => {
    prompt.value = val
}
</script>

<template>
    <a-modal v-model:open="visible" title="AI 智能编辑" :footer="null" width="880px" class="ai-edit-modal" centered>
        <div class="ai-edit-container">
            <!-- 左侧：编辑区 -->
            <div class="edit-section">
                <div class="section-title">
                    <span class="icon">✨</span>
                    <span>创作灵感</span>
                </div>

                <div class="prompt-input-wrapper">
                    <a-textarea
                        v-model:value="prompt"
                        placeholder="描述你想如何改变这张图片... 例如：'把背景换成繁星点点的夜空' 或 '给小狗戴上一顶红色的帽子'"
                        :rows="4"
                        class="custom-textarea"
                    />
                    <div class="char-count">{{ prompt.length }}/200</div>
                </div>

                <div class="presets-container">
                    <div class="sub-title">常用预设</div>
                    <div class="preset-tags">
                        <span
                            v-for="preset in presets"
                            :key="preset.value"
                            class="preset-tag"
                            @click="handlePresetClick(preset.value)"
                        >
                            {{ preset.label }}
                        </span>
                    </div>
                </div>

                <div class="action-bar">
                    <a-button
                        type="primary"
                        size="large"
                        block
                        :loading="loading"
                        class="generate-btn"
                        @click="handleGenerate"
                    >
                        <template #icon><RobotOutlined /></template>
                        {{ loading ? '魔法施展中...' : '开始 AI 编辑' }}
                    </a-button>
                </div>
            </div>

            <!-- 右侧：预览区 -->
            <div class="preview-section">
                <div class="preview-wrapper" :class="{ 'has-results': resultImages.length > 0 }">
                    <div v-if="!selectedImageUrl && !loading" class="empty-state">
                        <div class="original-preview">
                            <img :src="picture?.url" alt="Original" class="img-fluid" />
                            <div class="overlay-text">待编辑原图</div>
                        </div>
                    </div>

                    <div v-if="loading" class="loading-state">
                        <div class="loader">
                            <LoadingOutlined style="font-size: 48px; color: #3b82f6" />
                            <p>AI 正在分析并重构您的图片...</p>
                        </div>
                    </div>

                    <div v-if="selectedImageUrl && !loading" class="result-preview">
                        <a-image :src="selectedImageUrl" class="main-result-img" />
                        <div class="result-badge">AI 生成结果</div>
                    </div>
                </div>

                <!-- 候选图列表 -->
                <div v-if="resultImages.length > 1" class="candidates-list">
                    <div
                        v-for="(img, index) in resultImages"
                        :key="index"
                        class="candidate-item"
                        :class="{ active: selectedImageUrl === img }"
                        @click="selectedImageUrl = img"
                    >
                        <img :src="img" alt="Candidate" />
                        <div v-if="selectedImageUrl === img" class="active-check">
                            <CheckOutlined />
                        </div>
                    </div>
                </div>

                <div v-if="selectedImageUrl" class="apply-bar">
                    <a-button
                        type="primary"
                        size="large"
                        :loading="applyLoading"
                        class="apply-btn"
                        @click="handleApply"
                    >
                        <template #icon><CheckOutlined /></template>
                        应用此结果
                    </a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped lang="scss">
.ai-edit-modal {
    :deep(.ant-modal-content) {
        padding: 0;
        overflow: hidden;
        border-radius: 20px;
        background: rgb(255 255 255 / 90%);
        backdrop-filter: blur(20px);
        border: 1px solid rgb(255 255 255 / 30%);
    }

    :deep(.ant-modal-header) {
        padding: 20px 24px;
        background: transparent;
        border-bottom: 1px solid rgb(0 0 0 / 5%);
    }

    :deep(.ant-modal-title) {
        font-weight: 700;
        font-size: 18px;
        background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    :deep(.ant-modal-close) {
        top: 15px;
    }
}

.ai-edit-container {
    display: grid;
    grid-template-columns: 320px 1fr;
    min-height: 480px;

    @media (width <= 900px) {
        grid-template-columns: 1fr;
    }
}

.edit-section {
    padding: 20px;
    border-right: 1px solid rgb(0 0 0 / 5%);
    background: rgb(248 250 252 / 50%);

    .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        font-weight: 600;
        color: #334155;

        .icon {
            color: #3b82f6;
        }
    }

    .prompt-input-wrapper {
        position: relative;
        margin-bottom: 24px;

        .custom-textarea {
            border-radius: 12px;
            padding: 12px;
            border: 1px solid #e2e8f0;
            resize: none;
            transition: all 0.3s ease;

            &:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 4px rgb(59 130 246 / 10%);
            }
        }

        .char-count {
            position: absolute;
            bottom: 8px;
            right: 12px;
            font-size: 11px;
            color: #94a3b8;
        }
    }

    .sub-title {
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 12px;
    }

    .preset-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 30px;

        .preset-tag {
            padding: 6px 12px;
            border-radius: 8px;
            background: white;
            border: 1px solid #e2e8f0;
            font-size: 13px;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                border-color: #3b82f6;
                color: #3b82f6;
                background: #eff6ff;
                transform: translateY(-1px);
            }
        }
    }

    .generate-btn {
        height: 48px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 15px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow: 0 4px 12px rgb(37 99 235 / 20%);
        border: none;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgb(37 99 235 / 30%);
        }
    }
}

.preview-section {
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: white;

    .preview-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        min-height: 300px;
        border: 1px dashed #cbd5e1;
        transition: all 0.3s ease;

        &.has-results {
            border-style: solid;
            border-color: transparent;
            background: #0f172a;
        }
    }

    .empty-state {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .original-preview {
            position: relative;
            max-width: 80%;
            max-height: 80%;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgb(0 0 0 / 10%);

            img {
                max-width: 100%;
                max-height: 100%;
                display: block;
            }

            .overlay-text {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 8px;
                background: rgb(0 0 0 / 50%);
                backdrop-filter: blur(4px);
                color: white;
                font-size: 12px;
                text-align: center;
            }
        }
    }

    .loading-state {
        text-align: center;

        p {
            margin-top: 16px;
            color: #64748b;
            font-size: 14px;
        }
    }

    .result-preview {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        :deep(.ant-image) {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .main-result-img {
            max-width: 100%;
            max-height: 400px;
            object-fit: contain;
        }

        .result-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 6px 12px;
            background: rgb(16 185 129 / 90%);
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
        }
    }

    .candidates-list {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        padding: 4px;
        overflow-x: auto;

        .candidate-item {
            width: 70px;
            height: 70px;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
            position: relative;
            flex-shrink: 0;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            &.active {
                border-color: #3b82f6;
                transform: scale(1.05);
            }

            .active-check {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 18px;
                height: 18px;
                background: #3b82f6;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
            }
        }
    }

    .apply-bar {
        margin-top: auto;
        padding-top: 20px;
        display: flex;
        justify-content: center;

        .apply-btn {
            min-width: 200px;
            height: 48px;
            border-radius: 12px;
            font-weight: 600;
            background: #10b981;
            border-color: #10b981;

            &:hover {
                background: #059669;
                border-color: #059669;
                transform: translateY(-2px);
            }
        }
    }
}
</style>
