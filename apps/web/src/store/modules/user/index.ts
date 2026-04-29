import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userControllerGetLoginUserV1, userControllerUserLogoutV1 } from '@/api/user'
import { showAppMessage } from '@/utils/app-message'

const createEmptyLoginUser = (): API.LoginVoModel => ({
    id: '',
    userAccount: '',
    userAvatar: '',
    userProfile: '',
    userRole: '',
    userName: '',
    userEmail: ''
})

export const useUserStore = defineStore('user', () => {
    const loginUser = ref<API.LoginVoModel>(createEmptyLoginUser())
    let loginUserPromise: Promise<API.LoginVoModel> | null = null

    const fetchLoginUser = async () => {
        if (loginUserPromise) {
            return loginUserPromise
        }

        loginUserPromise = userControllerGetLoginUserV1()
            .then(data => {
                if (data.code === 1 && data.data) {
                    loginUser.value = data.data
                } else {
                    loginUser.value = createEmptyLoginUser()
                }

                return loginUser.value
            })
            .finally(() => {
                loginUserPromise = null
            })

        return loginUserPromise
    }

    const setLoginUser = async (user: API.LoginVoModel) => {
        loginUser.value = user
    }

    const resetLoginUser = () => {
        loginUser.value = createEmptyLoginUser()
    }

    const userLogout = async () => {
        const res = await userControllerUserLogoutV1()
        if (res.data) {
            showAppMessage('success', '退出登录成功')
            resetLoginUser()
        }
    }

    return {
        loginUser,
        fetchLoginUser,
        setLoginUser,
        resetLoginUser,
        userLogout
    }
})
