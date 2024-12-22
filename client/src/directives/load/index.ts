import type { Directive } from 'vue'
import { sessionCache } from '@/utils/cache'
import { debounce } from 'lodash'
const vLoad: Directive<HTMLDivElement, any> = {
    mounted(el, binding) {
        // @ts-ignore
        if (el._isBind) return
        const handleScroll = () => {
            const scrollTop = el.scrollTop
            const clientHeight = el.clientHeight
            const scrollHeight = el.scrollHeight
            if (scrollTop + clientHeight >= scrollHeight) {
                if (binding.modifiers.loaded) {
                    sessionCache.setCache('loaded', true)
                }
                binding.value(binding?.arg?.toString())
            }
        }

        const throttledScroll: any = debounce(handleScroll, 1000)
        // @ts-ignore
        el._scrollHandler = throttledScroll
        // @ts-ignore
        el._isBind = true
        el.addEventListener('scroll', throttledScroll)
    },
    unmounted(el) {
        // @ts-ignore
        el.removeEventListener('scroll', el._scrollHandler)
    }
}
export default vLoad
