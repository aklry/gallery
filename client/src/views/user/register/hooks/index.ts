import { reactive } from 'vue'
import { MD5 } from 'crypto-js'
import { message } from 'ant-design-vue'
import { userControllerUserRegisterV1 } from '@/api/user'
import { useRouter } from 'vue-router'
const useRegister = () => {
    const router = useRouter()
    const formState = reactive<API.UserRegisterDto>({
        userAccount: '',
        userPassword: '',
        checkedPassword: ''
    })
    const onFinish = async () => {
        const { userPassword, checkedPassword } = formState
        const md5Password = MD5(userPassword).toString()
        const md5CheckedPassword = MD5(checkedPassword).toString()
        if (md5Password !== md5CheckedPassword) {
            message.error('两次密码不一致')
            return
        }
        try {
            const res = await userControllerUserRegisterV1({
                userAccount: formState.userAccount,
                userPassword: md5Password,
                checkedPassword: md5CheckedPassword
            })
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
    return { formState, onFinish }
}

export default useRegister
