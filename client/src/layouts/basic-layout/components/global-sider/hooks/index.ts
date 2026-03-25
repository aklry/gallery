import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useGlobalSider = () => {
    const router = useRouter()
    const current = ref<string[]>(['/'])

    const handleClick = (key: string) => {
        router.push({ path: key })
    }

    router.afterEach((to, _from) => {
        current.value = [to.path]
    })

    return { handleClick, current }
}
