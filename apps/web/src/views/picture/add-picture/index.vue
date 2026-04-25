<script setup lang="ts">
import PictureUpload from '@/components/picture-upload/index.vue'
import useAddPicture from './hooks'
import ImageCropper from '@/components/image-cropper/index.vue'
import ImageExpand from '@/components/image-expand/index.vue'
import ImageAiEdit from '@/components/image-ai-edit/index.vue'
import {
    UploadOutlined,
    LinkOutlined,
    RobotOutlined,
    EditOutlined,
    ExpandOutlined,
    SaveOutlined,
    BulbOutlined
} from '@ant-design/icons-vue'

const {
    pictureInfo,
    picture,
    url,
    handleUploadSuccess,
    handleUpdatePicture,
    loading,
    tag_category,
    id,
    spaceId,
    uploadLoading,
    handleUploadPictureByUrl,
    openCropperModal,
    handleCropSuccess,
    handleExpandSuccess,
    openExpandModal,
    openAiEditModal,
    handleAiEditSuccess,
    text,
    handleGenerateImageTaskByAi,
    generateLoading,
    handleGenerateTags,
    generateTagsLoading
} = useAddPicture()
</script>

<template>
    <div class="mx-auto h-full max-w-[1200px] overflow-y-scroll px-4 md:px-8 py-8 md:py-10 no-scrollbar">
        <!-- 页面标题 -->
        <div class="mb-10 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm border border-blue-50"
                >
                    <UploadOutlined class="text-2xl text-blue-600" />
                </div>
                <div>
                    <h2 class="m-0 text-2xl font-bold tracking-tight text-gray-900">
                        {{ id ? '修改图片' : '上传新图片' }}
                    </h2>
                    <p class="mt-1 text-sm text-gray-500">支持文件、URL 上传以及 AI 文生图，自动分析提取图片信息</p>
                </div>
            </div>
        </div>

        <!-- 主面板 -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <!-- 上传面板 -->
            <div class="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40 overflow-hidden">
                <div class="border-b border-gray-50 bg-gray-50/50 px-6 py-5 flex items-center gap-3">
                    <div class="w-1 h-4 rounded-full bg-blue-500"></div>
                    <div>
                        <p class="m-0 font-bold text-gray-800">上传与生成</p>
                        <p class="mt-0.5 text-xs text-gray-500">提供多种图片获取方式，上传后即可进行编辑</p>
                    </div>
                </div>
                <div class="p-6 md:p-8">
                    <a-tabs type="card" class="custom-tabs" :tabBarStyle="{ marginBottom: '24px' }">
                        <a-tab-pane key="1">
                            <template #tab>
                                <span class="flex items-center gap-2 px-3 py-1 font-medium transition-colors">
                                    <UploadOutlined />文件上传
                                </span>
                            </template>
                            <div
                                class="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
                            >
                                <picture-upload
                                    :picture="picture"
                                    :spaceId="spaceId"
                                    :onUploadPictureSuccess="handleUploadSuccess"
                                />
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2">
                            <template #tab>
                                <span class="flex items-center gap-2 px-3 py-1 font-medium transition-colors">
                                    <LinkOutlined />网络 URL 导入
                                </span>
                            </template>
                            <div class="flex flex-col gap-4">
                                <p class="text-sm text-gray-500 m-0">直接粘贴网络图片的链接以快速导入图库：</p>
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a-input
                                        v-model:value="url"
                                        size="large"
                                        placeholder="https://example.com/image.png"
                                        allow-clear
                                        class="flex-1 rounded-lg"
                                    />
                                    <a-button
                                        :loading="uploadLoading"
                                        type="primary"
                                        size="large"
                                        class="!min-w-[120px] rounded-lg shadow-sm"
                                        @click="handleUploadPictureByUrl"
                                    >
                                        <span class="flex items-center justify-center gap-1.5">
                                            <UploadOutlined v-if="!uploadLoading" />立即上传
                                        </span>
                                    </a-button>
                                </div>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="3">
                            <template #tab>
                                <span class="flex items-center gap-2 px-3 py-1 font-medium transition-colors">
                                    <RobotOutlined />AI 文生图
                                </span>
                            </template>
                            <div class="flex flex-col gap-5">
                                <div class="bg-blue-50/80 p-4 rounded-xl border border-blue-100">
                                    <p class="text-sm text-blue-800 m-0 mb-3 flex items-center gap-2">
                                        <RobotOutlined class="text-lg" />
                                        <span>用精准的文字描述您想要的图片画面，AI 将为您智能生成：</span>
                                    </p>
                                    <a-textarea
                                        v-model:value="text"
                                        class="rounded-lg border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-100 placeholder:text-gray-400"
                                        placeholder="例如：一只金毛犬在绿油油的草坪上奔跑，阳光明媚，4K高清，吉卜力风格..."
                                        :rows="4"
                                        allow-clear
                                    />
                                </div>
                                <div class="flex justify-end">
                                    <a-button
                                        v-if="!url"
                                        :loading="generateLoading"
                                        type="primary"
                                        size="large"
                                        class="!min-w-[140px] rounded-lg shadow-md shadow-blue-500/20"
                                        @click="handleGenerateImageTaskByAi"
                                    >
                                        <span class="flex items-center justify-center gap-1.5">
                                            <RobotOutlined v-if="!generateLoading" />
                                            {{ generateLoading ? '正在施展魔法...' : '开始生成' }}
                                        </span>
                                    </a-button>
                                </div>

                                <!-- 生成结果预览 -->
                                <Transition name="fade">
                                    <div
                                        v-if="url"
                                        class="overflow-hidden rounded-xl border-2 border-blue-100 bg-white shadow-xl shadow-blue-900/5"
                                    >
                                        <!-- 图片展示区 -->
                                        <div
                                            class="relative flex items-center justify-center bg-gray-50/50 p-6 min-h-[250px]"
                                        >
                                            <a-image
                                                :src="url"
                                                alt="AI生成结果"
                                                class="max-h-[400px] w-full rounded-lg object-contain transform transition-transform hover:scale-[1.02] duration-300"
                                                style="
                                                    max-height: 400px;
                                                    object-fit: contain;
                                                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
                                                "
                                            />
                                        </div>
                                        <!-- 操作栏 -->
                                        <div
                                            class="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-5 py-4"
                                        >
                                            <div class="flex items-center gap-2">
                                                <span class="relative flex h-3 w-3">
                                                    <span
                                                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                                    ></span>
                                                    <span
                                                        class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                                                    ></span>
                                                </span>
                                                <span class="text-sm font-medium text-gray-700"
                                                    >创作完成，您可以将其保存入其中</span
                                                >
                                            </div>
                                            <div class="flex gap-3">
                                                <a-button
                                                    size="middle"
                                                    class="rounded-lg border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-400"
                                                    @click="
                                                        () => {
                                                            url = ''
                                                        }
                                                    "
                                                >
                                                    <span class="flex items-center gap-1.5">
                                                        <RobotOutlined />换一张
                                                    </span>
                                                </a-button>
                                                <a-button
                                                    size="middle"
                                                    type="primary"
                                                    class="rounded-lg shadow-sm"
                                                    :loading="uploadLoading"
                                                    @click="handleUploadPictureByUrl"
                                                >
                                                    <span class="flex items-center gap-1.5">
                                                        <UploadOutlined v-if="!uploadLoading" />保存至图库
                                                    </span>
                                                </a-button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>

            <!-- 图片信息面板 -->
            <Transition name="slide-up">
                <div
                    v-if="picture"
                    class="sticky top-10 h-fit rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40 overflow-hidden transition-all duration-300"
                >
                    <div class="border-b border-gray-50 bg-gray-50/50 px-6 py-5 flex items-center gap-3">
                        <div class="w-1 h-4 rounded-full bg-indigo-500"></div>
                        <div>
                            <p class="m-0 font-bold text-gray-800">图片元数据</p>
                            <p class="mt-0.5 text-xs text-gray-500">已智能获取信息，随时确认或修改</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <a-form :model="pictureInfo" layout="vertical" class="flex flex-col gap-1">
                            <a-form-item label="图片名称" name="name">
                                <a-input v-model:value="pictureInfo.name" placeholder="请输入图片名称" allow-clear />
                            </a-form-item>
                            <a-form-item label="图片简介" name="introduction">
                                <a-input
                                    v-model:value="pictureInfo.introduction"
                                    placeholder="请输入简介"
                                    allow-clear
                                />
                            </a-form-item>
                            <a-form-item label="图片分类" name="category">
                                <a-auto-complete
                                    v-model:value="pictureInfo.category"
                                    allowClear
                                    placeholder="请输入或选择分类"
                                    :options="tag_category?.categoryList"
                                />
                            </a-form-item>
                            <a-form-item label="图片标签" name="tags">
                                <div class="flex gap-2">
                                    <a-select
                                        v-model:value="pictureInfo.tags"
                                        :options="tag_category?.tagList"
                                        mode="tags"
                                        placeholder="请输入或选择标签"
                                        allow-clear
                                        class="flex-1"
                                    />
                                    <a-button
                                        @click="handleGenerateTags"
                                        :loading="generateTagsLoading"
                                        :disabled="!picture?.url"
                                        class="flex items-center justify-center gap-1.5 shadow-sm border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-400"
                                    >
                                        <RobotOutlined v-if="!generateTagsLoading" />
                                        智能提取
                                    </a-button>
                                </div>
                            </a-form-item>

                            <!-- 操作按钮组 -->
                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <a-button
                                    :loading="loading"
                                    type="primary"
                                    size="large"
                                    block
                                    @click="handleUpdatePicture"
                                    class="shadow-md shadow-blue-500/20 mb-3"
                                >
                                    <span class="flex items-center justify-center gap-1.5">
                                        <SaveOutlined v-if="!loading" />
                                        {{ id ? '保存修改' : '创建图片' }}
                                    </span>
                                </a-button>
                                <div class="flex gap-3">
                                    <a-button
                                        class="flex-1 border-gray-200 text-gray-600 hover:text-blue-500 hover:border-blue-500"
                                        @click="openCropperModal = true"
                                    >
                                        <span class="flex items-center justify-center gap-1.5">
                                            <EditOutlined />裁剪
                                        </span>
                                    </a-button>
                                    <a-button
                                        class="flex-1 border-purple-200 text-purple-600 hover:text-purple-700 hover:border-purple-500"
                                        @click="openExpandModal = true"
                                    >
                                        <span class="flex items-center justify-center gap-1.5">
                                            <ExpandOutlined />AI扩图
                                        </span>
                                    </a-button>
                                    <a-button
                                        class="flex-1 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-500"
                                        @click="openAiEditModal = true"
                                    >
                                        <span class="flex items-center justify-center gap-1.5">
                                            <BulbOutlined />AI编辑
                                        </span>
                                    </a-button>
                                </div>
                            </div>
                        </a-form>
                    </div>
                </div>
            </Transition>
        </div>
    </div>

    <image-cropper
        v-model:visible="openCropperModal"
        :imageUrl="picture?.url || ''"
        :picture="picture"
        :spaceId="spaceId"
        :onSuccess="handleCropSuccess"
    />
    <image-expand
        ref="imageExpandRef"
        v-model:visible="openExpandModal"
        :picture="picture"
        :onSuccess="handleExpandSuccess"
    />
    <image-ai-edit
        ref="imageAiEditRef"
        v-model:visible="openAiEditModal"
        :picture="picture"
        :onSuccess="handleAiEditSuccess"
    />
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
    width: 0;
}

.no-scrollbar {
    scrollbar-width: none;
}

/* 渐变动画 */
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.4s ease,
        transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.slide-up-enter-active {
    transition:
        opacity 0.5s ease-out,
        transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

/* 自定义Tabs样式 */
:deep(.custom-tabs .ant-tabs-nav::before) {
    border-bottom: none !important;
}

:deep(.custom-tabs .ant-tabs-tab) {
    background: transparent !important;
    border: none !important;
    border-radius: 8px !important;
    color: #6b7280;
    margin-right: 8px !important;
    padding: 6px 12px !important;
    transition: all 0.3s ease;
}

:deep(.custom-tabs .ant-tabs-tab:hover) {
    color: #3b82f6;
    background: #eff6ff !important;
}

:deep(.custom-tabs .ant-tabs-tab-active) {
    background: #e0e7ff !important;
    color: #4f46e5 !important;
    font-weight: 600;
    box-shadow: inset 0 0 0 1px #c7d2fe;
}
</style>
