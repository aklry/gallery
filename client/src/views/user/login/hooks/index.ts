import { nextTick, onMounted, reactive, ref, watch } from 'vue'
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
    const captchaCanvasRef = ref<HTMLCanvasElement | null>(null)
    const captchaValue = ref('')

    const loginForm = reactive({
        userAccount: '',
        userEmail: '',
        userPassword: '',
        code: ''
    })

    const drawCaptcha = () => {
        const canvas = captchaCanvasRef.value
        if (!canvas || !captchaValue.value) {
            return
        }

        const context = canvas.getContext('2d')
        if (!context) {
            return
        }

        const logicalWidth = 132
        const logicalHeight = 48
        const pixelRatio = window.devicePixelRatio || 1

        canvas.width = logicalWidth * pixelRatio
        canvas.height = logicalHeight * pixelRatio
        canvas.style.width = `${logicalWidth}px`
        canvas.style.height = `${logicalHeight}px`
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        context.clearRect(0, 0, logicalWidth, logicalHeight)

        // 浅色背景（无渐变）
        context.fillStyle = '#f8fafc'
        context.fillRect(0, 0, logicalWidth, logicalHeight)

        // 干扰线（浅色主题）
        for (let index = 0; index < 5; index += 1) {
            context.strokeStyle = `rgba(148, 163, 184, ${0.2 + Math.random() * 0.3})`
            context.lineWidth = 1 + Math.random() * 1.5
            context.beginPath()
            context.moveTo(Math.random() * logicalWidth, Math.random() * logicalHeight)
            context.bezierCurveTo(
                Math.random() * logicalWidth,
                Math.random() * logicalHeight,
                Math.random() * logicalWidth,
                Math.random() * logicalHeight,
                Math.random() * logicalWidth,
                Math.random() * logicalHeight
            )
            context.stroke()
        }

        // 干扰点（浅色主题）
        for (let index = 0; index < 18; index += 1) {
            context.fillStyle = `rgba(59, 130, 246, ${0.1 + Math.random() * 0.2})`
            context.beginPath()
            context.arc(
                Math.random() * logicalWidth,
                Math.random() * logicalHeight,
                Math.random() * 1.8 + 0.6,
                0,
                Math.PI * 2
            )
            context.fill()
        }

        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.font = '600 25px Georgia'

        // 验证码文字颜色（深色主题）
        captchaValue.value.split('').forEach((character, index) => {
            const x = 22 + index * 28
            const y = logicalHeight / 2 + (Math.random() * 8 - 4)
            const rotation = ((Math.random() * 28 - 14) * Math.PI) / 180

            context.save()
            context.translate(x, y)
            context.rotate(rotation)
            context.shadowColor = 'rgba(59, 130, 246, 0.15)'
            context.shadowBlur = 4
            context.fillStyle = ['#1e40af', '#2563eb', '#1e3a8a', '#3b82f6'][index % 4]
            context.fillText(character, 0, 0)
            context.restore()
        })
    }

    const refreshCaptcha = async (silent = false) => {
        try {
            captchaLoading.value = true
            const response = await userControllerGetLoginCaptchaV1()

            if (response.code !== 1 || !response.data) {
                throw new Error(response.message || '获取验证码失败')
            }

            captchaValue.value = response.data
            loginForm.code = ''
            await nextTick()
            drawCaptcha()
        } catch (error) {
            captchaValue.value = ''
            if (!silent) {
                message.error('验证码加载失败，请重试')
            }
        } finally {
            captchaLoading.value = false
        }
    }

    const handleSubmit = async () => {
        const inputCode = loginForm.code.trim()

        if (!captchaValue.value) {
            message.warning('验证码尚未就绪，请刷新后重试')
            return
        }

        if (inputCode.length !== 4) {
            message.warning('请输入 4 位验证码')
            return
        }

        if (inputCode !== captchaValue.value) {
            message.error('验证码填写不正确')
            await refreshCaptcha(true)
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

    watch(tabKey, async () => {
        loginForm.code = ''
        await nextTick()
        drawCaptcha()
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
        captchaCanvasRef,
        refreshCaptcha
    }
}

export default useLogin
