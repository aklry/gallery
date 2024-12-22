import type { Directive } from 'vue'
import { sessionCache } from '@/utils/cache'

interface CustomElement extends HTMLElement {
    _observer?: IntersectionObserver
}
let current = 0
const vLoad: Directive<CustomElement, any> = {
    mounted(el, binding) {
        if ('_observer' in el) return

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].intersectionRatio > 0) {
                    sessionCache.setCache('loaded', true)
                    current++
                    binding.value(current.toString())
                }
            },
            {
                root: null,
                rootMargin: '20px', // 提前20px触发
                threshold: 0.1 // 当目标元素10%可见时触发
            }
        )

        el._observer = observer
        observer.observe(el)
    },
    unmounted(el) {
        current = 0
        if ('_observer' in el) {
            el._observer?.disconnect()
            delete el._observer
        }
    }
}
export default vLoad
