import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes
})

const DEFAULT_TITLE = '映刻'

router.afterEach(to => {
    const title = to.meta.title as string | undefined
    document.title = title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE
})

export default router
