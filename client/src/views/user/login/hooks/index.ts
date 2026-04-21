import { onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userControllerUserLoginByEmailV1, userControllerUserLoginV1 } from '@/api/user'
import { MD5 } from 'crypto-js'
import { aliyunCaptchaPrefix, aliyunCaptchaSceneId, hasConfiguredAliyunCaptcha } from '@/constants/captcha'

declare global {
    interface Window {
        initAliyunCaptcha: any
    }
}

const useLogin = () => {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const tabKey = ref('account')

    let captchaInstance: any = null

    const loginForm = reactive({
        userAccount: '',
        userEmail: '',
        userPassword: '',
        captchaVerifyParam: ''
    })

    const initCaptcha = () => {
        if (!window.initAliyunCaptcha) {
            console.error('Aliyun Captcha SDK not loaded')
            return
        }
        if (!hasConfiguredAliyunCaptcha) {
            message.warning('请先配置 VITE_ALIYUN_CAPTCHA_SCENE_ID')
            return
        }
        window.initAliyunCaptcha({
            SceneId: aliyunCaptchaSceneId,
            prefix: aliyunCaptchaPrefix,
            mode: 'popup',
            element: '#aliyun-captcha-element',
            button: '',
            captchaVerifyCallback: async (captchaVerifyParam: string) => {
                loginForm.captchaVerifyParam = captchaVerifyParam
                return {
                    captchaResult: await doLogin()
                }
            },
            onBizResultCallback: (bizResult: boolean) => {
                if (bizResult === true) {
                    message.success('登录成功')
                    const redirect = router.currentRoute.value.query.redirect as string
                    router.push(redirect || '/')
                }
            },
            getInstance: (instance: any) => {
                captchaInstance = instance
            },
            upLang: 'cn'
        })
    }

    const doLogin = async () => {
        try {
            loading.value = true
            let res
            const md5Password = MD5(loginForm.userPassword).toString()

            if (tabKey.value === 'email') {
                res = await userControllerUserLoginByEmailV1({
                    userEmail: loginForm.userEmail,
                    userPassword: md5Password,
                    captchaVerifyParam: loginForm.captchaVerifyParam
                } as any)
            } else {
                res = await userControllerUserLoginV1({
                    userAccount: loginForm.userAccount,
                    userPassword: md5Password,
                    captchaVerifyParam: loginForm.captchaVerifyParam
                } as any)
            }

            if (res.code === 1) {
                await userStore.setLoginUser(res.data)
                return true
            } else {
                message.error(res.message)
                return false
            }
        } catch (error) {
            message.error('登录失败，请重试')
            return false
        } finally {
            loading.value = false
        }
    }

    const handleSubmit = async () => {
        if (captchaInstance) {
            captchaInstance.show()
        } else {
            message.warning('验证码尚未加载完成，请刷新页面')
            initCaptcha()
        }
    }

    watch(tabKey, () => {
        // Handle tab change if necessary
    })

    onMounted(() => {
        initCaptcha()
    })

    return {
        tabKey,
        loginForm,
        handleSubmit,
        loading
    }
}

export default useLogin
