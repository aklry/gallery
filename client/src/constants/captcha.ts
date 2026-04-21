const fallbackSceneId = 'YOUR_SCENE_ID'

export const aliyunCaptchaSceneId = import.meta.env.VITE_ALIYUN_CAPTCHA_SCENE_ID || fallbackSceneId
export const aliyunCaptchaPrefix = import.meta.env.VITE_ALIYUN_CAPTCHA_PREFIX || ''

export const hasConfiguredAliyunCaptcha = aliyunCaptchaSceneId !== fallbackSceneId
