import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userControllerGetLoginUserV1, userControllerUserLogoutV1 } from '@/api/user'
import { message } from 'ant-design-vue'

export const useUserStore = defineStore('user', () => {
    const loginUser = ref<API.LoginVoModel>({
        id: '',
        userAccount: '',
        userAvatar: '',
        userProfile: '',
        userRole: '',
        userName: ''
    })
    const fetchLoginUser = async () => {
        const data = await userControllerGetLoginUserV1()
        if (data.code !== 40100) {
            loginUser.value = data.data
        }
    }
    const setLoginUser = async (user: API.LoginVoModel) => {
        loginUser.value = user
    }
    const userLogout = async () => {
        const res = await userControllerUserLogoutV1()
        if (res.data) {
            message.success('退出登录成功')
            loginUser.value = {
                id: '',
                userAccount: '',
                userAvatar: '',
                userProfile: '',
                userRole: '',
                userName: ''
            }
        }
    }
    return {
        loginUser,
        fetchLoginUser,
        setLoginUser,
        userLogout
    }
})
