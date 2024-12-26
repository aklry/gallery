import { pictureControllerListPictureTagCategoryV1 } from '@/api/picture'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TagCategory } from './type'

const usePictureStore = defineStore(
    'picture',
    () => {
        const tag_category = ref<TagCategory>({
            tagList: [],
            categoryList: []
        })

        const getTagCategory = async () => {
            const res = await pictureControllerListPictureTagCategoryV1()
            const tagList = res.data.tagList.map(item => ({ value: item }))
            const categoryList = res.data.categoryList.map(item => ({ value: item }))

            tag_category.value = { tagList, categoryList } as TagCategory
        }

        return { tag_category, getTagCategory }
    },
    {
        persist: true
    }
)

export default usePictureStore
