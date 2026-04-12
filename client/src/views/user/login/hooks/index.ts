import { onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import {
    userControllerGetLoginCaptchaV1,
    userControllerUserLoginByEmailV1,
    userControllerUserLoginV1
} from '@/api/user'
import { MD5 } from 'crypto-js'

const useLogin = () => {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const captchaLoading = ref(false)
    const tabKey = ref('account')
    const captchaImageUrl = ref('')

    const loginForm = reactive({
        userAccount: '',
        userEmail: '',
        userPassword: '',
        code: ''
    })

    const refreshCaptcha = async (silent = false) => {
        try {
            captchaLoading.value = true
            const response = await userControllerGetLoginCaptchaV1()

            if (response.code !== 1 || !response.data) {
                throw new Error(response.message || '获取验证码失败')
            }

            captchaImageUrl.value = response.data
            loginForm.code = ''
        } catch (error) {
            captchaImageUrl.value = ''
            if (!silent) {
                message.error('验证码加载失败，请重试')
            }
        } finally {
            captchaLoading.value = false
        }
    }

    const handleSubmit = async () => {
        const inputCode = loginForm.code.trim()

        if (!captchaImageUrl.value) {
            message.warning('验证码尚未就绪，请刷新后重试')
            return
        }

        if (inputCode.length !== 4) {
            message.warning('请输入 4 位验证码')
            return
        }

        try {
            loading.value = true
            let res
            const md5Password = MD5(loginForm.userPassword).toString()

            if (tabKey.value === 'email') {
                res = await userControllerUserLoginByEmailV1({
                    userEmail: loginForm.userEmail,
                    userPassword: md5Password,
                    code: inputCode
                })
            } else {
                res = await userControllerUserLoginV1({
                    userAccount: loginForm.userAccount,
                    userPassword: md5Password,
                    code: inputCode
                })
            }

            if (res.code === 1) {
                await userStore.setLoginUser(res.data)
                message.success('登录成功')
                const redirect = router.currentRoute.value.query.redirect as string
                router.push(redirect || '/')
            } else {
                message.error(res.message)
                await refreshCaptcha(true)
            }
        } catch (error) {
            message.error('登录失败，请重试')
            await refreshCaptcha(true)
        } finally {
            loading.value = false
        }
    }

    watch(tabKey, () => {
        loginForm.code = ''
    })

    onMounted(() => {
        refreshCaptcha(true)
    })

    return {
        tabKey,
        loginForm,
        handleSubmit,
        loading,
        captchaLoading,
        captchaImageUrl,
        refreshCaptcha
    }
}

export default useLogin
