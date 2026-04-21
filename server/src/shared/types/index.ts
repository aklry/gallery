export interface Response<T> {
    code: number
    message: string
    data: T
}

export interface YamlOssConfig {
    oss: OssConfig
    bailian: BailianConfig
    email: EmailConfig
    captcha: CaptchaConfig
}

export interface BailianConfig {
    apiKey: string
}

export interface OssConfig {
    region: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
}

export interface EmailConfig {
    host: string
    port: number
    user: string
    password: string
    useSSL: 0 | 1
    from: string
}

export interface CaptchaConfig {
    accessKeyId: string
    accessKeySecret: string
    sceneId: string
}
