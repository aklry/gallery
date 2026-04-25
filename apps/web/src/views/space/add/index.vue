<script setup lang="ts">
import { formatSize } from '@/utils'
import { useAddSpace } from './hooks'
import { SpaceLevelOptions } from '@/constants'
import { CloudUploadOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'

const { form, handleCreateSpace, loading, spaceLevelList } = useAddSpace()

const spaceTypeOptions = [
    {
        label: '私人空间',
        value: 0
    },
    {
        label: '团队空间',
        value: 1
    }
]
</script>

<template>
    <div class="mx-auto h-full max-w-[800px] overflow-y-scroll px-4 md:px-8 py-8 md:py-12 no-scrollbar">
        <!-- 页面标题 -->
        <div class="mb-10 text-center">
            <div
                class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 shadow-sm border border-indigo-50 mb-4"
            >
                <CloudUploadOutlined class="text-3xl text-indigo-600" />
            </div>
            <h2 class="m-0 text-3xl font-bold tracking-tight text-gray-900">创建新空间</h2>
            <p class="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
                创建一个独立的空间来管理您的图片资源。根据您的需求选择合适的空间等级，随时升级以获取更多容量。
            </p>
        </div>

        <div class="flex flex-col gap-8 md:gap-10">
            <!-- 表单区域 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/40">
                <a-form :model="form" layout="vertical" @finish="handleCreateSpace" class="space-y-2">
                    <a-form-item
                        label="空间名称"
                        name="spaceName"
                        :rules="[{ required: true, message: '请输入空间名称' }]"
                    >
                        <a-input
                            v-model:value="form.spaceName"
                            size="large"
                            placeholder="为您的空间起个响亮的名字"
                            allow-clear
                            class="rounded-lg h-12"
                        />
                    </a-form-item>
                    <a-form-item
                        label="空间类型"
                        name="spaceType"
                        :rules="[{ required: true, message: '请选择空间类型' }]"
                    >
                        <a-radio-group v-model:value="form.spaceType" class="space-type-group">
                            <a-radio-button
                                v-for="option in spaceTypeOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item
                        label="空间等级"
                        name="spaceLevel"
                        :rules="[{ required: true, message: '请选择空间等级' }]"
                    >
                        <a-select
                            v-model:value="form.spaceLevel"
                            size="large"
                            :options="SpaceLevelOptions"
                            placeholder="选择合适的空间等级"
                            class="w-full rounded-lg"
                        />
                    </a-form-item>
                    <div class="pt-4">
                        <a-button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            :loading="loading"
                            block
                            class="h-12 rounded-lg shadow-md shadow-indigo-500/20 text-base font-medium"
                        >
                            <span class="flex items-center justify-center gap-2">
                                <PlusOutlined v-if="!loading" />
                                立即创建
                            </span>
                        </a-button>
                    </div>
                </a-form>
            </div>

            <!-- 空间级别介绍 -->
            <div class="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 md:p-8">
                <div class="mb-5 flex items-center gap-2">
                    <InfoCircleOutlined class="text-xl text-blue-500" />
                    <h3 class="m-0 text-lg font-bold text-gray-800">空间级别介绍</h3>
                </div>

                <div class="rounded-xl bg-white/80 p-4 border border-blue-50/50 shadow-sm mb-6">
                    <p class="m-0 text-sm leading-relaxed text-gray-600">
                        <span class="font-semibold text-blue-600">💡 提示：</span>
                        目前空间等级分为免费、基础、高级三种，免费空间为
                        <strong class="text-gray-800">100MB</strong>，基础空间为
                        <strong class="text-gray-800">1000MB</strong>，高级空间为
                        <strong class="text-gray-800">10000MB</strong>。
                        <span class="block mt-1.5 text-orange-500"
                            >※ 目前仅支持首开免费版，如需升级扩容，请联系专属客服。</span
                        >
                    </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="level in spaceLevelList"
                        :key="level.text"
                        class="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 duration-300"
                    >
                        <div
                            class="absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 opacity-60"
                        ></div>
                        <p class="relative z-10 m-0 text-lg font-bold text-gray-800">{{ level.text }}</p>
                        <div class="relative z-10 mt-3 flex flex-col gap-2 text-sm text-gray-500">
                            <span class="flex items-center gap-2 whitespace-nowrap">
                                <span class="w-1.5 h-1.5 shrink-0 rounded-full bg-blue-400"></span>
                                容量上限：<strong class="text-gray-700">{{ formatSize(level.maxSize) }}</strong>
                            </span>
                            <span class="flex items-center gap-2 whitespace-nowrap">
                                <span class="w-1.5 h-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                图片数量：<strong class="text-gray-700">{{ level.maxCount }} 张</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
    width: 0;
}

.no-scrollbar {
    scrollbar-width: none;
}

.space-type-group {
    display: flex;
    width: 100%;
}

.space-type-group :deep(.ant-radio-button-wrapper) {
    flex: 1;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 覆盖 Ant Design 下拉框高度 */
:deep(.ant-select-selector) {
    border-radius: 0.5rem !important;
    height: 3rem !important;
    align-items: center;
}
</style>
