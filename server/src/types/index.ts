export interface Response<T> {
    code: number
    message: string
    data: T
}

export interface YamlOssConfig {
    oss: OssConfig
    bailian: BailianConfig
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
