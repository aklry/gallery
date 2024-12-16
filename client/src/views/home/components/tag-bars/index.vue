<template>
    <div class="tag-bars">
        <span style="margin-right: 8px">标签:</span>
        <a-space :size="[0, 8]" wrap>
            <a-checkable-tag
                v-for="(tag, index) in tag_category.tagList"
                :key="tag.value"
                v-model:checked="selectedTags[index]"
                @change="(checked: boolean) => changeTags(tag.value, checked, index)"
            >
                {{ tag.value }}
            </a-checkable-tag>
        </a-space>
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

<style scoped lang="scss">
.tag-bars {
    @apply pl-5 mb-5;
}
</style>
