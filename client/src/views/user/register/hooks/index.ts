import { reactive, ref, onUnmounted } from 'vue'
import { MD5 } from 'crypto-js'
import { message } from 'ant-design-vue'
import {
    userControllerUserRegisterV1,
    userControllerUserRegisterByEmailV1,
    userControllerUserRegisterByEmailCodeV1
} from '@/api/user'
import { useRouter } from 'vue-router'

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

    onUnmounted(() => {
        if (timer) {
            clearInterval(timer)
        }
    })

    const sendCode = async () => {
        if (!formState.userEmail) {
            message.warning('请先输入邮箱')
            return
        }
        try {
            isSending.value = true
            const res = await userControllerUserRegisterByEmailCodeV1({
                userEmail: formState.userEmail
            })
            if (res.code === 1) {
                message.success('验证码发送成功')
                countdown.value = 60
                timer = setInterval(() => {
                    countdown.value--
                    if (countdown.value <= 0) {
                        clearInterval(timer)
                    }
                }, 1000)
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('验证码发送失败')
        } finally {
            isSending.value = false
        }
    }

    const onFinish = async () => {
        const { userPassword, checkedPassword } = formState
        const md5Password = MD5(userPassword).toString()
        const md5CheckedPassword = MD5(checkedPassword).toString()
        if (md5Password !== md5CheckedPassword) {
            message.error('两次密码不一致')
            return
        }
        try {
            let res
            if (tabKey.value === 'email') {
                res = await userControllerUserRegisterByEmailV1({
                    userEmail: formState.userEmail,
                    code: formState.code,
                    userPassword: md5Password,
                    checkedPassword: md5CheckedPassword
                })
            } else {
                res = await userControllerUserRegisterV1({
                    userAccount: formState.userAccount,
                    userPassword: md5Password,
                    checkedPassword: md5CheckedPassword
                })
            }

            if (res.code === 1) {
                message.success('注册成功')
                router.push('/user/login')
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('注册失败')
        }
    }
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
