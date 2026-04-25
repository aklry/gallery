import { reactive, ref, onUnmounted, onMounted } from 'vue'
import { MD5 } from 'crypto-js'
import { message } from 'ant-design-vue'
import {
    userControllerUserRegisterV1,
    userControllerUserRegisterByEmailV1,
    userControllerUserRegisterByEmailCodeV1
} from '@/api/user'
import { useRouter } from 'vue-router'
import { aliyunCaptchaSceneId, hasConfiguredAliyunCaptcha } from '@/constants/captcha'
import { loadAliyunCaptchaSdk } from '@/utils/aliyunCaptcha'

const CAPTCHA_INIT_TIMEOUT = 3000

const useRegister = () => {
    const router = useRouter()
    const tabKey = ref('account')

    const formState = reactive({
        userAccount: '',
        userEmail: '',
        code: '',
        userPassword: '',
        checkedPassword: ''
    })

    const isSending = ref(false)
    const countdown = ref(0)
    let timer: any = null
    let captchaInstance: any = null
    let captchaInitPromise: Promise<any> | null = null
    let currentAction = ''

    onUnmounted(() => {
        if (timer) {
            clearInterval(timer)
        }
    })

    const doSendCode = async (captchaVerifyParam: string) => {
        try {
            isSending.value = true
            const res = await userControllerUserRegisterByEmailCodeV1({
                userEmail: formState.userEmail,
                captchaVerifyParam
            } as any)

            if (res.code === 1) {
                message.success('验证码发送成功')
                countdown.value = 60
                timer = setInterval(() => {
                    countdown.value--
                    if (countdown.value <= 0) {
                        clearInterval(timer)
                    }
                }, 1000)
                return true
            }

            message.error(res.message)
            return false
        } catch (error) {
            message.error('验证码发送失败')
            return false
        } finally {
            isSending.value = false
        }
    }

    const doRegister = async (captchaVerifyParam: string) => {
        const { userPassword, checkedPassword } = formState
        const md5Password = MD5(userPassword).toString()
        const md5CheckedPassword = MD5(checkedPassword).toString()

        if (md5Password !== md5CheckedPassword) {
            message.error('两次密码不一致')
            return false
        }

        try {
            let res

            if (tabKey.value === 'email') {
                res = await userControllerUserRegisterByEmailV1({
                    userEmail: formState.userEmail,
                    code: formState.code,
                    userPassword: md5Password,
                    checkedPassword: md5CheckedPassword,
                    captchaVerifyParam
                } as any)
            } else {
                res = await userControllerUserRegisterV1({
                    userAccount: formState.userAccount,
                    userPassword: md5Password,
                    checkedPassword: md5CheckedPassword,
                    captchaVerifyParam
                } as any)
            }

            if (res.code === 1) {
                return true
            }

            message.error(res.message)
            return false
        } catch (error) {
            message.error('注册失败')
            return false
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
                button: '#register-captcha-trigger',
                captchaVerifyCallback: async (captchaVerifyParam: string) => {
                    if (currentAction === 'sendCode') {
                        return { captchaResult: await doSendCode(captchaVerifyParam) }
                    }

                    if (currentAction === 'register') {
                        return { captchaResult: await doRegister(captchaVerifyParam) }
                    }

                    return { captchaResult: false }
                },
                onBizResultCallback: (bizResult: boolean) => {
                    if (bizResult === true && currentAction === 'register') {
                        message.success('注册成功')
                        router.push('/user/login')
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

    const sendCode = () => {
        if (!formState.userEmail) {
            message.warning('请先输入邮箱')
            return
        }

        currentAction = 'sendCode'
        void showCaptcha()
    }

    const onFinish = () => {
        currentAction = 'register'
        void showCaptcha()
    }

    onMounted(() => {
        void initCaptcha()
    })

    return {
        tabKey,
        formState,
        isSending,
        countdown,
        sendCode,
        onFinish
    }
}

export default useRegister
