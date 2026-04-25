import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useGlobalSider = () => {
    const router = useRouter()
    const current = ref<string[]>(['/'])

    const handleClick = (key: string) => {
        router.push({ path: key })
    }

    router.afterEach((to, _from) => {
        const path = to.path
        if (path.startsWith('/space/') && path !== '/space/admin') {
            current.value = ['/space/user']
        } else {
            current.value = [path]
        }
    })

    watch(
        () => router.currentRoute.value,
        newVal => {
            current.value = [newVal.path]
        },
        {
            immediate: true
        }
    )

    return { handleClick, current }
}
