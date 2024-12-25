import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { spaceControllerListSpaceV1 } from '@/api/space'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'

export const useUserSpace = () => {
    const userStore = useUserStore()
    const router = useRouter()
    // 检查用户是否有个人空间
    const checkUserHasSpace = async () => {
        const loginUser = userStore.loginUser
        if (!loginUser || !loginUser.id) {
            router.replace('/user/login')
            return
        }
        // 获取用户空间信息
        const res = await spaceControllerListSpaceV1({
            userId: loginUser.id,
            current: '1',
            pageSize: '1'
        })
        if (res.code === 1) {
            if (res.data.list.length > 0) {
                const space = res.data.list[0]
                router.replace(`/space/${space.id}`)
            } else {
                router.replace('/space/add')
            }
        } else {
            message.error(res.message)
        }
    }
    onMounted(() => {
        checkUserHasSpace()
    })
}
