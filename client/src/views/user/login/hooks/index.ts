import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userControllerUserLoginByEmailV1, userControllerUserLoginV1 } from '@/api/user'
import { MD5 } from 'crypto-js'
import { aliyunCaptchaSceneId, hasConfiguredAliyunCaptcha } from '@/constants/captcha'
import { loadAliyunCaptchaSdk } from '@/utils/aliyunCaptcha'

const CAPTCHA_INIT_TIMEOUT = 3000

const useLogin = () => {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const tabKey = ref('account')

    let captchaInstance: any = null
    let captchaInitPromise: Promise<any> | null = null

    const loginForm = reactive({
        userAccount: '',
        userEmail: '',
        userPassword: '',
        captchaVerifyParam: ''
    })

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
            }

            message.error(res.message)
            return false
        } catch (error) {
            message.error('登录失败，请重试')
            return false
        } finally {
            loading.value = false
        }
    }

    const initCaptcha = async () => {
        if (captchaInstance) {
            return captchaInstance
        }

        if (captchaInitPromise) {
            return captchaInitPromise
        }

        if (!hasConfiguredAliyunCaptcha) {
            message.warning('请先配置阿里云验证码 SceneId 和 Prefix')
            return null
        }

        if (!(await loadAliyunCaptchaSdk()) || !window.initAliyunCaptcha) {
            console.error('Aliyun Captcha SDK not loaded')
            return null
        }

        captchaInitPromise = new Promise(resolve => {
            let resolved = false

            const resolveInstance = (instance: any = null) => {
                if (resolved) {
                    return
                }

                resolved = true
                captchaInitPromise = null
                resolve(instance)
            }

            window.initAliyunCaptcha({
                SceneId: aliyunCaptchaSceneId,
                mode: 'popup',
                element: '#aliyun-captcha-element',
                button: '#login-captcha-trigger',
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
                    resolveInstance(instance)
                },
                onError: (error: unknown) => {
                    console.error('Aliyun Captcha init error', error)
                    resolveInstance(null)
                },
                language: 'cn'
            })

            window.setTimeout(() => {
                resolveInstance(captchaInstance)
            }, CAPTCHA_INIT_TIMEOUT)
        })

        return captchaInitPromise
    }

    const showCaptcha = async () => {
        const instance = captchaInstance || (await initCaptcha())

        if (instance) {
            instance.show()
            return
        }

        message.warning('验证码尚未加载完成，请稍后重试')
    }

    const handleSubmit = async () => {
        await showCaptcha()
    }

    onMounted(() => {
        void initCaptcha()
    })

    return {
        tabKey,
        loginForm,
        handleSubmit,
        loading
    }
}

export default useLogin
