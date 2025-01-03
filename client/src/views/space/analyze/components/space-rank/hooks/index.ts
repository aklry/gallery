import { ECBasicOption } from 'echarts/types/dist/shared'
import { analyzeControllerGetSpaceRankAnalyzeV1 } from '@/api/analyze'
import { message } from 'ant-design-vue'
import { ref, watchEffect, computed } from 'vue'
export const useSpaceRankAnalyzeHooks = () => {
    const loading = ref(false)
    const spaceRankAnalyze = ref<API.SpaceRankAnalyzeModelVo[]>([])
    const fetchSpaceRankAnalyze = async () => {
        loading.value = true
        try {
            const res = await analyzeControllerGetSpaceRankAnalyzeV1({ topN: 10 })
            if (res.code === 1) {
                spaceRankAnalyze.value = res.data
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取空间排行失败')
        } finally {
            loading.value = false
        }
    }
    const options = computed<ECBasicOption>(() => {
        const spaceName = spaceRankAnalyze.value.map(item => item.spaceName)
        const totalSize = spaceRankAnalyze.value.map(item => (item.totalSize / 1024 / 1024).toFixed(2))
        return {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: spaceName
            },
            yAxis: {
                type: 'value',
                name: '空间使用量（MB）'
            },
            series: [
                {
                    name: '空间使用量（MB）',
                    type: 'bar',
                    data: totalSize,
                    itemStyle: {
                        color: '#547046'
                    }
                }
            ]
        }
    })
    watchEffect(async () => {
        await fetchSpaceRankAnalyze()
    })
    return {
        loading,
        spaceRankAnalyze,
        options
    }
}
