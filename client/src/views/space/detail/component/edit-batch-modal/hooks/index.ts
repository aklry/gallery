import { computed, reactive, toRefs, useTemplateRef } from 'vue'
import usePictureStore from '@/store/modules/picture'
import { EditBatchProps } from '../types'
import { type FormInstance } from 'ant-design-vue'
export const useEditBatchModal = (props: EditBatchProps) => {
    const pictureStore = usePictureStore()
    const editBatchParams = reactive<API.EditPictureByBatchDto>({
        idList: [],
        spaceId: '',
        nameRule: '',
        category: '',
        tags: []
    })
    const formRef = useTemplateRef<FormInstance>('form')
    const { pictureList } = toRefs(props)
    const idList = computed(() => {
        if (!pictureList?.value) return []
        return pictureList.value.map(item => ({
            label: item.filename,
            value: item.id
        }))
    })
    const categoryList = computed(() => pictureStore.tag_category.categoryList)
    const tagList = computed(() => pictureStore.tag_category.tagList)

    const handleOk = () => {
        props.onOk(editBatchParams, () => {
            formRef.value?.resetFields()
        })
    }
    return {
        editBatchParams,
        categoryList,
        tagList,
        idList,
        handleOk
    }
}
