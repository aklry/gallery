import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import checkAccess from './checkAccess'
import AccessEnum from './accessEnum'

router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()
    let loginUser = userStore.loginUser
    if (!loginUser || !loginUser.id) {
        await userStore.fetchLoginUser()
        loginUser = userStore.loginUser
    }
    const needAccess = (to.meta.access as AccessEnum) ?? AccessEnum.NOT_LOGIN
    // 跳转的页面需要登录
    if (needAccess !== AccessEnum.NOT_LOGIN) {
        // 没有登录
        if (!loginUser || !loginUser.userRole || loginUser.userRole === AccessEnum.NOT_LOGIN) {
            next(`/user/login?redirect=${to.fullPath}`)
            return
        }
        // 登录了但没权限
        if (!checkAccess(loginUser, needAccess)) {
            next(`/noAuth`)
            return
        }
    }
    next()
})
