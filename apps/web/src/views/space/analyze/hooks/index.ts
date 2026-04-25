import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

export const useSpaceAnalyzeHooks = () => {
    const route = useRoute()
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const spaceUsageData = ref<API.SpaceUsageAnalyzeModelVo>()
    const spaceId = computed<string>(() => (route.query.spaceId || '') as string)
    const queryAll = computed<boolean>(() => !!route.query.all)
    const queryPublic = computed<boolean>(() => !!route.query.public)
    const isAdmin = computed<boolean>(() => loginUser.value?.userRole === 'admin')
    return {
        spaceId,
        queryAll,
        queryPublic,
        spaceUsageData,
        isAdmin
    }
}
