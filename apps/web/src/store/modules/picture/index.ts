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
        const tag_category_loaded = ref(false)
        let tagCategoryPromise: Promise<void> | null = null

        const getTagCategory = async (force = false) => {
            if (!force && tag_category_loaded.value) {
                return
            }
            if (tagCategoryPromise) {
                return tagCategoryPromise
            }

            tagCategoryPromise = pictureControllerListPictureTagCategoryV1()
                .then(res => {
                    const tagList = res.data?.tagList?.map(item => ({ value: item })) ?? []
                    const categoryList = res.data?.categoryList?.map(item => ({ value: item })) ?? []

                    tag_category.value = { tagList, categoryList } as TagCategory
                    tag_category_loaded.value = true
                })
                .catch(error => {
                    console.error('Failed to get picture tag category:', error)
                })
                .finally(() => {
                    tagCategoryPromise = null
                })

            return tagCategoryPromise
        }

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
