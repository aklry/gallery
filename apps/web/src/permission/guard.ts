import AccessEnum from './accessEnum.ts'
import checkAccess from './checkAccess.ts'

export interface PermissionGuardRouteLike {
    fullPath: string
    meta: {
        access?: AccessEnum
    }
}

export interface PermissionGuardDeps {
    ensureLoginUserLoaded: () => Promise<unknown>
    getLoginUser: () => LoginUserLike
}

export interface LoginUserLike {
    id?: string
    userRole?: string
}

export const createPermissionGuard = ({ ensureLoginUserLoaded, getLoginUser }: PermissionGuardDeps) => {
    return async (to: PermissionGuardRouteLike) => {
        const needAccess = (to.meta.access as AccessEnum) ?? AccessEnum.NOT_LOGIN

        if (needAccess === AccessEnum.NOT_LOGIN) {
            return true
        }

        try {
            await ensureLoginUserLoaded()
        } catch (error) {
            // 网络异常时保留当前用户态检查结果，避免导航直接中断
        }

        const loginUser = getLoginUser()

        if (!loginUser?.id || !loginUser.userRole || loginUser.userRole === AccessEnum.NOT_LOGIN) {
            return `/user/login?redirect=${to.fullPath}`
        }

        if (!checkAccess(loginUser as LoginUserLike, needAccess)) {
            return '/noAuth'
        }

        return true
    }
}
