import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userControllerUserLoginV1 } from '@/api/user'
import { MD5 } from 'crypto-js'
const useLogin = () => {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)

    const loginForm = reactive<API.UserLoginDto>({
        userAccount: '',
        userPassword: ''
    })

    const handleSubmit = async (values: API.UserLoginDto) => {
        try {
            loading.value = true
            const res = await userControllerUserLoginV1({
                userAccount: values.userAccount,
                userPassword: MD5(values.userPassword).toString()
            })
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
        loginForm,
        handleSubmit,
        loading
    }
}

export default useLogin
