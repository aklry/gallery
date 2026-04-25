import { analyzeControllerGetSpaceUsageAnalyzeV1 } from '@/api/analyze.ts'
import { message } from 'ant-design-vue'
import { watchEffect, ref, toRefs } from 'vue'
import { ISpaceAnaLyzeProps } from '../../types'

export const useSpaceAnalyze = (props: ISpaceAnaLyzeProps) => {
    const { queryPublic, queryAll, spaceId } = toRefs(props)
    const spaceUsageData = ref<API.SpaceUsageAnalyzeModelVo>()
    const fetchSpaceUsageData = async () => {
        const res = await analyzeControllerGetSpaceUsageAnalyzeV1({
            queryPublic: queryPublic?.value,
            queryAll: queryAll?.value,
            spaceId: spaceId?.value
        })
        if (res.code === 1) {
            spaceUsageData.value = res.data
        } else {
            message.error(res.message)
        }
    }
    watchEffect(async () => {
        await fetchSpaceUsageData()
    })
    return {
        spaceUsageData
    }
}
