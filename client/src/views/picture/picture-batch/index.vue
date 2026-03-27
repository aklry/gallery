<script lang="ts" setup>
import usePictureBatchHook from './hooks'
import { PictureOutlined, SearchOutlined, NumberOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'

const { formState, handleSubmit, loading } = usePictureBatchHook()
</script>

<template>
    <div class="min-h-full bg-[#f5f7fa] px-6 py-8">
        <div class="mx-auto flex max-w-2xl flex-col gap-5">
            <!-- 页面标题区 -->
            <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e6f4ff]">
                    <CloudUploadOutlined class="text-[26px] text-[#1677ff]" />
                </div>
                <div>
                    <h2 class="m-0 text-xl font-bold leading-tight text-[#262626]">批量添加图片</h2>
                    <p class="mt-1 text-[13px] text-[#8c8c8c]">通过关键词从网络自动抓取图片并批量入库</p>
                </div>
            </div>

            <!-- 表单卡片 -->
            <div class="rounded-xl border border-[#f0f0f0] bg-white px-8 py-7 shadow-sm">
                <a-form :model="formState" layout="vertical" class="flex flex-col gap-1">
                    <a-form-item name="keywords">
                        <template #label>
                            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#262626]">
                                <SearchOutlined class="text-[13px] text-[#1677ff]" />
                                搜索关键词
                            </span>
                        </template>
                        <a-input
                            v-model:value="formState.keywords"
                            placeholder="请输入图片关键词，如：风景、动物、建筑..."
                            size="large"
                            allow-clear
                        />
                        <div class="mt-1.5 text-xs text-[#bfbfbf]">关键词将用于从图库中检索匹配的图片</div>
                    </a-form-item>

                    <a-form-item name="count">
                        <template #label>
                            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#262626]">
                                <NumberOutlined class="text-[13px] text-[#1677ff]" />
                                抓取数量
                            </span>
                        </template>
                        <a-input-number
                            v-model:value="formState.count"
                            :min="1"
                            :max="100"
                            size="large"
                            class="count-input"
                            placeholder="请输入数量"
                        />
                        <div class="mt-1.5 text-xs text-[#bfbfbf]">建议单次抓取不超过 100 张</div>
                    </a-form-item>

                    <div class="mt-2 border-t border-[#f5f5f5] pt-5">
                        <a-button
                            type="primary"
                            size="large"
                            :loading="loading"
                            class="submit-btn w-full !h-11 !rounded-lg !text-[15px] !font-semibold"
                            @click="handleSubmit"
                        >
                            <span style="display: inline-flex; align-items: center; gap: 6px">
                                <PictureOutlined v-if="!loading" />
                                {{ loading ? '正在抓取中...' : '开始批量上传' }}
                            </span>
                        </a-button>
                    </div>
                </a-form>
            </div>

            <!-- 使用提示 -->
            <div class="rounded-xl border border-[#bae0ff] bg-[#f0f7ff] px-5 py-4">
                <p class="mb-2.5 mt-0 text-[13px] font-semibold text-[#1677ff]">使用说明</p>
                <ul class="m-0 flex flex-col gap-1.5 pl-[18px]">
                    <li class="text-[13px] leading-relaxed text-[#595959]">
                        输入准确的关键词可以获得更高质量的图片结果
                    </li>
                    <li class="text-[13px] leading-relaxed text-[#595959]">抓取完成后将自动跳转回图片管理页面</li>
                    <li class="text-[13px] leading-relaxed text-[#595959]">已有重复图片将被自动过滤，不会重复入库</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.count-input.ant-input-number) {
    width: 100%;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgb(22 119 255 / 35%);
}
</style>
