import { pictureControllerListPictureTagCategoryV1 } from '@/api/picture'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createTagCategoryRequestController } from './tag-category-request'
import { TagCategory } from './type'

const usePictureStore = defineStore(
    'picture',
    () => {
        const tag_category = ref<TagCategory>({
            tagList: [],
            categoryList: []
        })
        const tag_category_loaded = ref(false)
        const getTagCategory = createTagCategoryRequestController(
            pictureControllerListPictureTagCategoryV1,
            {
                get value() {
                    return tag_category.value
                },
                set value(value: TagCategory) {
                    tag_category.value = value
                },
                get loaded() {
                    return tag_category_loaded.value
                },
                set loaded(value: boolean) {
                    tag_category_loaded.value = value
                }
            },
            error => {
                console.error('Failed to get picture tag category:', error)
            }
        )

        return { tag_category, tag_category_loaded, getTagCategory }
    },
    {
        persist: {
            storage: sessionStorage,
            pick: ['tag_category', 'tag_category_loaded']
        }
    }
)

export default usePictureStore
