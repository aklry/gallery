import { ref, computed, watchEffect } from 'vue'
import { ECBasicOption } from 'echarts/types/dist/shared'
import { ISpaceTagProps } from '../types'
import { analyzeControllerGetSpaceTagAnalyzeV1 } from '@/api/analyze'
import { message } from 'ant-design-vue'

export const useSpaceTag = (props: ISpaceTagProps) => {
    const { queryAll, queryPublic, spaceId } = props
    const loading = ref<boolean>(false)
    const spaceTagData = ref<API.SpaceTagAnalyzeModelVo[]>([])
    const querySpaceTagData = async () => {
        loading.value = true
        try {
            const res = await analyzeControllerGetSpaceTagAnalyzeV1({
                queryAll,
                queryPublic,
                spaceId
            })
            if (res.code === 1) {
                spaceTagData.value = res.data
            }
            loading.value = false
        } catch (error) {
            loading.value = false
            message.error('获取标签数据失败')
        } finally {
            loading.value = false
        }
    }
    const options = computed<ECBasicOption>(() => {
        const tagData = spaceTagData.value.map(item => ({
            name: item.tag,
            value: item.count
        }))
        return {
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => `${params.name}: ${params.value}次`
            },
            series: [
                {
                    type: 'wordCloud',
                    gridSize: 10,
                    sizeRange: [12, 50],
                    rotationRange: [-90, 90],
                    shape: 'circle',
                    textStyle: {
                        color: () =>
                            `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                    },
                    data: tagData
                }
            ]
        }
    })
    watchEffect(async () => {
        await querySpaceTagData()
    })
    return {
        options,
        loading,
        spaceTagData,
        querySpaceTagData
    }
}
