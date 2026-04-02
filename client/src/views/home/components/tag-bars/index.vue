<template>
    <div class="flex items-start pl-2 mb-6">
        <div class="flex items-center pr-5 pt-1.5 flex-shrink-0 select-none">
            <span class="mr-1.5 text-[16px] text-blue-500 opacity-90"><i class="ri-price-tag-3-line"></i></span>
            <span class="text-gray-600 font-bold text-[15px] tracking-widest relative">
                标签
                <span
                    class="absolute -bottom-1.5 left-0 w-3/4 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full opacity-60"
                ></span>
            </span>
        </div>
        <div class="flex flex-wrap gap-3 flex-1">
            <button
                v-for="(tag, index) in tag_category.tagList"
                :key="tag.value"
                @click="changeTags(tag.value, !selectedTags[index], index)"
                class="group relative px-4 py-1.5 rounded-full text-[14px] transition-all duration-300 ease-out select-none cursor-pointer border overflow-hidden outline-none origin-center"
                :class="[
                    selectedTags[index]
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30 border-transparent font-medium translate-y-0 active:scale-95'
                        : 'bg-white/80 backdrop-blur-md text-gray-600 border-gray-200/80 hover:border-blue-300/80 hover:text-blue-600 hover:bg-blue-50/80 hover:shadow-sm hover:-translate-y-0.5 active:scale-95'
                ]"
            >
                <!-- Hover light effect for active state -->
                <div
                    v-if="selectedTags[index]"
                    class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></div>

                <span class="relative z-10">{{ tag.value }}</span>
                <span
                    v-if="selectedTags[index]"
                    class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-80 shadow-[0_0_4px_rgba(255,255,255,0.8)] z-10"
                ></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TagCategory } from '@/store/modules/picture/type'
import { ref } from 'vue'

const props = defineProps<{
    tag_category: TagCategory
}>()
const emit = defineEmits(['changeTags'])
let selectedTags = ref<boolean[]>(props.tag_category.tagList.map(() => false))
const changeTags = (tag: string, _checked: boolean, index: number) => {
    selectedTags.value = selectedTags.value.map((_, i) => {
        if (i === index) {
            return _checked
        }
        return false
    })
    emit('changeTags', tag, _checked)
}
</script>
