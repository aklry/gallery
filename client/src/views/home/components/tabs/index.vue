<template>
    <div class="flex items-center pl-2 mb-5 border-b border-gray-200/60 overflow-x-auto" style="scrollbar-width: none">
        <div class="flex space-x-2 relative pb-[1px]">
            <button
                @click="changeTabs('all')"
                class="group relative px-5 py-3 text-[15px] transition-all duration-300 ease-out whitespace-nowrap outline-none flex items-center justify-center font-medium rounded-t-xl select-none"
                :class="
                    activeKey === 'all'
                        ? 'text-blue-600 bg-blue-50/40'
                        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50/80'
                "
            >
                <i
                    v-if="activeKey === 'all'"
                    class="ri-apps-line mr-1.5 text-[17px] text-blue-500 opacity-90 transition-transform group-hover:scale-110"
                ></i>
                <i
                    v-else
                    class="ri-apps-line mr-1.5 text-[17px] text-gray-400 group-hover:text-blue-400 transition-colors"
                ></i>
                <span>全部</span>

                <!-- Active Underline Indicator -->
                <div
                    v-if="activeKey === 'all'"
                    class="absolute -bottom-[1px] left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-full shadow-[0_-2px_8px_rgba(59,130,246,0.4)] z-10"
                ></div>
            </button>

            <button
                v-for="item in tag_category.categoryList"
                :key="item.value"
                @click="changeTabs(item.value)"
                class="group relative px-5 py-3 text-[15px] transition-all duration-300 ease-out whitespace-nowrap outline-none flex items-center justify-center font-medium rounded-t-xl select-none"
                :class="
                    activeKey === item.value
                        ? 'text-blue-600 bg-blue-50/40'
                        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50/80'
                "
            >
                <span>{{ item.value }}</span>

                <!-- Active Underline Indicator -->
                <div
                    v-if="activeKey === item.value"
                    class="absolute -bottom-[1px] left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-full shadow-[0_-2px_8px_rgba(59,130,246,0.4)] z-10"
                ></div>
            </button>
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
