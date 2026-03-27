import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userControllerUserLoginV1, userControllerUserLoginByEmailV1 } from '@/api/user'
import { MD5 } from 'crypto-js'

const useLogin = () => {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const tabKey = ref('account')

    const loginForm = reactive({
        userAccount: '',
        userEmail: '',
        userPassword: ''
    })

    const handleSubmit = async () => {
        try {
            loading.value = true
            let res
            const md5Password = MD5(loginForm.userPassword).toString()

            if (tabKey.value === 'email') {
                res = await userControllerUserLoginByEmailV1({
                    userEmail: loginForm.userEmail,
                    userPassword: md5Password
                })
            } else {
                res = await userControllerUserLoginV1({
                    userAccount: loginForm.userAccount,
                    userPassword: md5Password
                })
            }

            if (res.code === 1) {
                await userStore.setLoginUser(res.data)
                message.success('登录成功')
                const redirect = router.currentRoute.value.query.redirect as string
                router.push(redirect || '/')
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('登录失败，请重试')
        } finally {
            loading.value = false
        }
    }
    return {
        tabKey,
        loginForm,
        handleSubmit,
        loading
    }
}

export default useLogin
