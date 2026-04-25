export const aliyunCaptchaSceneId = import.meta.env.VITE_APP_ALIYUN_CAPTCHA_SCENE_ID || ''
export const aliyunCaptchaPrefix = import.meta.env.VITE_APP_ALIYUN_CAPTCHA_PREFIX || ''
export const hasConfiguredAliyunCaptcha = Boolean(aliyunCaptchaSceneId && aliyunCaptchaPrefix)
