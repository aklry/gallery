import { ECBasicOption } from 'echarts/types/dist/shared'

import { analyzeControllerGetUserAnalyzeV1 } from '@/api/analyze'
import { computed, ref, toRefs, watchEffect } from 'vue'
import { ISpaceUserProps } from '../types'
import { message } from 'ant-design-vue'

export const useSpaceUser = (props: ISpaceUserProps) => {
    const spaceUserData = ref<API.SpaceUserAnalyzeModelVo[]>([])
    const loading = ref(false)
    const userId = ref('')
    const timeDimension = ref<'day' | 'week' | 'month'>('day')
    const timeDimensionOptions = [
        {
            label: '日',
            value: 'day'
        },
        {
            label: '周',
            value: 'week'
        },
        {
            label: '月',
            value: 'month'
        }
    ]
    const { queryAll, queryPublic, spaceId } = toRefs(props)
    const getSpaceUserData = async () => {
        loading.value = true
        try {
            const res = await analyzeControllerGetUserAnalyzeV1({
                queryAll: queryAll?.value,
                queryPublic: queryPublic?.value,
                spaceId: spaceId?.value,
                userId: userId.value,
                timeDimension: timeDimension.value
            })
            if (res.code === 1) {
                spaceUserData.value = res.data
            }
        } catch (error) {
            message.error('获取用户空间使用分析失败')
        } finally {
            loading.value = false
        }
    }
    const options = computed<ECBasicOption>(() => {
        const periods = spaceUserData.value.map(item => item.period)
        const data = spaceUserData.value.map(item => item.count)
        return {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: periods,
                name: '时间区间'
            },
            yAxis: {
                type: 'value',
                name: '上传数量'
            },
            series: [
                {
                    name: '上传数量',
                    type: 'line',
                    smooth: true,
                    data,
                    emphasis: {
                        focus: 'series'
                    }
                }
            ]
        }
    })
    watchEffect(async () => {
        await getSpaceUserData()
    })
    return { spaceUserData, loading, options, timeDimension, timeDimensionOptions, userId }
}
