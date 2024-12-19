import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useMenus } from '../../../hooks'
import { ref } from 'vue'
const useGlobalHeaderHooks = () => {
    const { items } = useMenus()
    const router = useRouter()
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const current = ref<string[]>(['home'])
    const handleClickLogin = () => {
        router.push({
            path: '/user/login'
        })
    }
    const handleLogout = async () => {
        await userStore.userLogout()
        router.push('/user/login')
    }
    const changeRoute = ({ key }: { key: string }) => {
        router.push({
            path: key
        })
    }
    router.afterEach(to => {
        current.value = [to.path]
    })
    return {
        items,
        loginUser,
        current,
        handleClickLogin,
        handleLogout,
        changeRoute
    }
}

export default useGlobalHeaderHooks
