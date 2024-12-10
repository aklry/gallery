import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userControllerGetLoginUserV1 } from '@/api/user'

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
    return {
        loginUser,
        fetchLoginUser,
        setLoginUser
    }
})
