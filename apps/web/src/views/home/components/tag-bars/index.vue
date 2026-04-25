<template>
    <div class="flex items-start pl-2 mb-6">
        <div class="flex items-center pr-6 pt-0.5 flex-shrink-0 select-none">
            <div
                class="flex items-center px-3 py-1.5 rounded-lg bg-blue-50/80 text-blue-600 shadow-sm border border-blue-100/50"
            >
                <i class="ri-price-tag-3-line text-[16px] mr-1.5"></i>
                <span class="font-bold text-[14px] tracking-wider">标签</span>
            </div>
        </div>

        <div
            class="flex flex-wrap gap-3 flex-1 items-center overflow-hidden transition-all duration-300 ease-in-out relative"
        >
            <button
                v-for="tag in displayTags"
                :key="tag.value"
                @click="changeTags(tag.value, !isSelected(tag.value))"
                class="group px-4 py-1.5 rounded-full text-[13px] transition-all duration-300 ease-out select-none cursor-pointer outline-none flex items-center"
                :class="[
                    isSelected(tag.value)
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 font-medium'
                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'
                ]"
            >
                <span>{{ tag.value }}</span>
            </button>

            <!-- 展开/收起按钮 -->
            <button
                v-if="showExpandBtn"
                @click="isExpanded = !isExpanded"
                class="group px-3 py-1.5 rounded-full text-[13px] transition-all duration-300 ease-out select-none cursor-pointer outline-none flex items-center bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-700 border border-gray-100"
            >
                <span class="mr-1">{{ isExpanded ? '收起' : '展开' }}</span>
                <i :class="isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'" class="text-[14px]"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TagCategory } from '@/store/modules/picture/type'
import { ref, computed } from 'vue'

const props = defineProps<{
    tag_category: TagCategory
}>()
const emit = defineEmits(['changeTags'])

const maxVisibleTags = 12
const isExpanded = ref(false)

let selectedTags = ref<boolean[]>(props.tag_category.tagList.map(() => false))

const displayTags = computed(() => {
    if (isExpanded.value) return props.tag_category.tagList

    // Collapsed state
    const visibleTags = props.tag_category.tagList.slice(0, maxVisibleTags)

    // Check if selected tag is outside visible range
    const selectedIndex = selectedTags.value.findIndex(Boolean)
    if (selectedIndex >= maxVisibleTags) {
        return [...visibleTags, props.tag_category.tagList[selectedIndex]]
    }

    return visibleTags
})

const showExpandBtn = computed(() => props.tag_category.tagList.length > maxVisibleTags)

const isSelected = (tagValue: string) => {
    const idx = props.tag_category.tagList.findIndex(t => t.value === tagValue)
    return idx !== -1 ? selectedTags.value[idx] : false
}

const changeTags = (tagValue: string, _checked: boolean) => {
    const index = props.tag_category.tagList.findIndex(t => t.value === tagValue)
    if (index !== -1) {
        selectedTags.value = selectedTags.value.map((_, i) => (i === index ? _checked : false))
    }
    emit('changeTags', tagValue, _checked)
}
</script>
