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
        userName: '',
        userEmail: ''
    })
    const fetchLoginUser = async () => {
        const data = await userControllerGetLoginUserV1()
        if (data.code === 1 && data.data) {
            loginUser.value = data.data
        } else {
            loginUser.value = {
                id: '',
                userAccount: '',
                userAvatar: '',
                userProfile: '',
                userRole: '',
                userName: '',
                userEmail: ''
            }
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
                userName: '',
                userEmail: ''
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
