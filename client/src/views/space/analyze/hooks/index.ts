import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

export const useSpaceAnalyzeHooks = () => {
    const route = useRoute()
    const spaceUsageData = ref<API.SpaceUsageAnalyzeModelVo>()
    const spaceId = computed(() => route.query.spaceId as string)
    const queryAll = computed(() => !!route.query.all)
    const queryPublic = computed(() => !!route.query.public)

    return {
        spaceId,
        queryAll,
        queryPublic,
        spaceUsageData
    }
}
