import { SpaceLevelEnum } from '@/constants'
import { onMounted, reactive, ref } from 'vue'
import { spaceControllerAddSpaceV1, spaceControllerListSpaceLevelV1 } from '@/api/space'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export const useAddSpace = () => {
    const router = useRouter()
    const form = reactive<API.CreateSpaceDto>({
        spaceName: '',
        spaceLevel: SpaceLevelEnum.FREE,
        spaceType: 0
    })
    const spaceLevelList = ref<API.SpaceLevelVoModel[]>([])
    const loading = ref(false)
    const handleCreateSpace = async () => {
        loading.value = true
        try {
            const res = await spaceControllerAddSpaceV1(form)
            if (res.code === 1) {
                message.success('创建空间成功')
                router.push({
                    path: `/space/${res.data}`
                })
            } else {
                message.error(res.message)
            }
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }
    onMounted(async () => {
        try {
            const res = await spaceControllerListSpaceLevelV1()
            if (res.code === 1) {
                spaceLevelList.value = res.data
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取空间等级失败')
        }
    })
    return {
        form,
        handleCreateSpace,
        loading,
        spaceLevelList
    }
}
