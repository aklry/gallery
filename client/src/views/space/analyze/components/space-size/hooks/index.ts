import { computed, ref, watchEffect } from 'vue'
import { ISpaceSizeProps } from '../types'
import { analyzeControllerGetSpaceSizeAnalyzeV1 } from '@/api/analyze'
import { message } from 'ant-design-vue'
import { ECBasicOption } from 'echarts/types/dist/shared'

export const useSpaceSize = (props: ISpaceSizeProps) => {
    const { queryAll, queryPublic, spaceId } = props
    const loading = ref<boolean>(false)
    const spaceSizeData = ref<API.SpaceSizeModelVo[]>([])
    const querySpaceSizeData = async () => {
        loading.value = true
        try {
            const res = await analyzeControllerGetSpaceSizeAnalyzeV1({
                queryAll,
                queryPublic,
                spaceId
            })
            if (res.code === 1) {
                spaceSizeData.value = res.data
            }
        } catch (error) {
            message.error('获取空间大小数据失败')
        } finally {
            loading.value = false
        }
    }
    const options = computed<ECBasicOption>(() => {
        const pieData = spaceSizeData.value.map(item => ({
            name: item.sizeRange,
            value: item.count
        }))
        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                top: 'bottom'
            },
            series: [
                {
                    name: '图片大小',
                    type: 'pie',
                    radius: '50%',
                    data: pieData
                }
            ]
        }
    })
    watchEffect(() => {
        querySpaceSizeData()
    })
    return {
        loading,
        options,
        spaceSizeData
    }
}
