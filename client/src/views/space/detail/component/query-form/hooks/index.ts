import { ref, useTemplateRef } from 'vue'
import usePictureStore from '@/store/modules/picture'
import { storeToRefs } from 'pinia'
import { FormInstance, message } from 'ant-design-vue'
import { pictureControllerGetPictureByPageVoV1, pictureControllerGetPictureByColorV1 } from '@/api/picture.ts'
import { QueryFormPropsType } from '../types'
import dayjs, { type Dayjs } from 'dayjs'

export const useQueryFormHooks = (props: QueryFormPropsType) => {
    type RangeValue = [Dayjs, Dayjs]
    const pictureStore = usePictureStore()
    const dateRange = ref<RangeValue>()
    const { tag_category } = storeToRefs(pictureStore)
    const picColor = ref<string>('')
    const initParams = {
        current: '1',
        pageSize: '10',
        sortOrder: 'desc',
        sortField: 'createTime'
    }
    const rangePresets = ref([
        { label: '过去7天', value: [dayjs().add(-7, 'day'), dayjs()] },
        { label: '过去30天', value: [dayjs().add(-30, 'day'), dayjs()] },
        { label: '昨天', value: [dayjs().add(-1, 'day'), dayjs()] }
    ])
    const searchParams = ref<API.QueryPictureDto>({
        ...initParams
    })
    const form = useTemplateRef<FormInstance>('formRef')
    const doSearch = async (newQueryParams: API.QueryPictureDto) => {
        if (dateRange.value && dateRange.value.length === 2) {
            const [start, end] = dateRange.value
            newQueryParams.startEditTime = start.toISOString()
            newQueryParams.endEditTime = end.toISOString()
        }
        try {
            let res: API.ShowPictureVo
            if (picColor.value) {
                res = await pictureControllerGetPictureByColorV1({
                    color: picColor.value,
                    spaceId: props.spaceId as string
                })
            } else {
                res = await pictureControllerGetPictureByPageVoV1({
                    ...initParams,
                    ...newQueryParams,
                    spaceId: props.spaceId
                })
            }
            if (res.code === 1) {
                props.onSuccess?.(res)
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('搜索数据失败，请重试')
        }
    }
    const doReset = () => {
        form.value?.resetFields()
        picColor.value = ''
        props.onReset?.()
    }
    const handlePureColorChange = (color: string) => {
        picColor.value = color
    }
    return {
        searchParams,
        tag_category,
        dateRange,
        rangePresets,
        doSearch,
        doReset,
        handlePureColorChange
    }
}
