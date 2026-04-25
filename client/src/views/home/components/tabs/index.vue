<template>
    <div class="flex items-center pl-2 mb-5">
        <!-- 分类 Label -->
        <div class="flex items-center pr-6 flex-shrink-0 select-none">
            <div
                class="flex items-center px-3 py-1.5 rounded-lg bg-indigo-50/80 text-indigo-600 shadow-sm border border-indigo-100/50"
            >
                <i class="ri-function-line text-[16px] mr-1.5"></i>
                <span class="font-bold text-[14px] tracking-wider">分类</span>
            </div>
        </div>

        <div class="flex-1 overflow-x-auto border-b border-gray-100" style="scrollbar-width: none">
            <div class="flex space-x-6 relative min-w-max px-2">
                <button
                    @click="changeTabs('all')"
                    class="group relative py-3 text-[15px] transition-all duration-300 ease-out whitespace-nowrap outline-none flex items-center justify-center font-medium select-none"
                    :class="activeKey === 'all' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'"
                >
                    <span>全部</span>
                    <!-- Active Underline -->
                    <div
                        class="absolute -bottom-[1px] left-0 w-full h-[3px] rounded-t-full transition-all duration-300"
                        :class="
                            activeKey === 'all'
                                ? 'bg-indigo-500 opacity-100'
                                : 'bg-transparent opacity-0 group-hover:bg-indigo-200 group-hover:opacity-100'
                        "
                    ></div>
                </button>

                <button
                    v-for="item in tag_category.categoryList"
                    :key="item.value"
                    @click="changeTabs(item.value)"
                    class="group relative py-3 text-[15px] transition-all duration-300 ease-out whitespace-nowrap outline-none flex items-center justify-center font-medium select-none"
                    :class="activeKey === item.value ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'"
                >
                    <span>{{ item.value }}</span>
                    <!-- Active Underline -->
                    <div
                        class="absolute -bottom-[1px] left-0 w-full h-[3px] rounded-t-full transition-all duration-300"
                        :class="
                            activeKey === item.value
                                ? 'bg-indigo-500 opacity-100'
                                : 'bg-transparent opacity-0 group-hover:bg-indigo-200 group-hover:opacity-100'
                        "
                    ></div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TagCategory } from '@/store/modules/picture/type'
import { ref } from 'vue'

defineProps<{
    tag_category: TagCategory
}>()

const emit = defineEmits(['changeTabs'])
const activeKey = ref('all')

const changeTabs = (key: string) => {
    activeKey.value = key
    emit('changeTabs', key)
}
</script>
