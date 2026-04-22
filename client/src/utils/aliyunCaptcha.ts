import { aliyunCaptchaPrefix } from '@/constants/captcha'

const ALIYUN_CAPTCHA_SDK_SRC = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'

let sdkLoadPromise: Promise<boolean> | null = null

declare global {
    interface Window {
        AliyunCaptchaConfig?: {
            prefix: string
            region: string
        }
        initAliyunCaptcha?: any
    }
}

export const loadAliyunCaptchaSdk = () => {
    if (window.initAliyunCaptcha) {
        return Promise.resolve(true)
    }

    if (!aliyunCaptchaPrefix) {
        return Promise.resolve(false)
    }

    if (sdkLoadPromise) {
        return sdkLoadPromise
    }

    window.AliyunCaptchaConfig = {
        prefix: aliyunCaptchaPrefix,
        region: 'cn'
    }

    sdkLoadPromise = new Promise(resolve => {
        const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${ALIYUN_CAPTCHA_SDK_SRC}"]`)
        const script = existingScript || document.createElement('script')

        const resolveLoaded = (loaded: boolean) => {
            script.onload = null
            script.onerror = null
            if (!loaded) {
                sdkLoadPromise = null
                if (!existingScript) {
                    script.remove()
                }
            }
            resolve(loaded)
        }

        script.onload = () => {
            resolveLoaded(Boolean(window.initAliyunCaptcha))
        }

        script.onerror = () => {
            resolveLoaded(false)
        }

        if (!existingScript) {
            script.src = ALIYUN_CAPTCHA_SDK_SRC
            script.async = true
            document.head.appendChild(script)
        }
    })

    return sdkLoadPromise
}
