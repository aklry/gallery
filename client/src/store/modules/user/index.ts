import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const loginUser = ref<any>({
        userName: ''
    })
    const fetchLoginUser = async () => {
        // todo 获取登录用户信息
    }
    const setLoginUser = async (user: any) => {
        loginUser.value = user
    }
    return {
        loginUser,
        fetchLoginUser,
        setLoginUser
    }
})
