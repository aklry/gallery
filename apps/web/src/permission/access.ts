import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import { createPermissionGuard } from './guard'

router.beforeEach(async to => {
    const userStore = useUserStore()

    return createPermissionGuard({
        ensureLoginUserLoaded: userStore.fetchLoginUser,
        getLoginUser: () => userStore.loginUser
    })(to)
})
