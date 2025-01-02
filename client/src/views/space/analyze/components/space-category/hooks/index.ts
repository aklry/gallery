import { analyzeControllerGetSpaceCategoryAnalyzeV1 } from '@/api/analyze.ts'
import { message } from 'ant-design-vue'
import { ECBasicOption } from 'echarts/types/dist/shared'
import { computed, ref, watchEffect } from 'vue'
import { ISpaceCategoryProps } from '../types'

export const useSpaceCategory = (props: ISpaceCategoryProps) => {
    const spaceCategoryData = ref<API.SpaceCategoryAnalyzeModelVo[]>()
    const fetchSpaceCategoryData = async () => {
        try {
            const res = await analyzeControllerGetSpaceCategoryAnalyzeV1({
                queryPublic: props.queryPublic,
                queryAll: props.queryAll,
                spaceId: props.spaceId
            })
            if (res.code === 1) {
                spaceCategoryData.value = res.data
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取数据失败')
        }
    }
    const options = computed(() => {
        const categoryData = spaceCategoryData.value?.map(item => item.category)
        const countData = spaceCategoryData.value?.map(item => item.count)
        const sizeData = spaceCategoryData.value?.map(item => (item.totalSize / 1024 / 1024).toFixed(2))
        return {
            tooltip: { trigger: 'axis' },
            legend: {
                data: ['图片数量', '图片总大小'],
                top: 'bottom'
            },
            xAxis: {
                type: 'category',
                data: categoryData
            },
            yAxis: [
                {
                    type: 'value',
                    name: '图片数量',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#5470C6'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '图片总大小（MB）',
                    position: 'right',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#91CC75'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#91CC75',
                            type: 'dashed'
                        }
                    }
                }
            ],
            series: [
                { name: '图片数量', type: 'bar', data: countData, yAxisIndex: 0 },
                { name: '图片总大小', type: 'bar', data: sizeData, yAxisIndex: 1 }
            ]
        } as ECBasicOption
    })
    watchEffect(async () => {
        await fetchSpaceCategoryData()
    })
    return {
        spaceCategoryData,
        options
    }
}
