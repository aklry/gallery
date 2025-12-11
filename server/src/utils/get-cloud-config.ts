import * as fs from 'node:fs'
import * as path from 'node:path'
import { load } from 'js-yaml'

interface YamlOssConfig {
    oss: OssConfigArray
    bailian: BailianConfig[]
}

interface IRegin {
    region: string
}

interface IAccessKeyId {
    accessKeyId: string
}

interface IAccessKeySecret {
    accessKeySecret: string
}

interface IBucket {
    bucket: string
}

type OssConfigArray = [IRegin, IAccessKeyId, IAccessKeySecret, IBucket]

interface BailianConfig {
    apiKey: string
}

interface OssConfig {
    region: string
    accessKeyId: string
    accessKeySecret: string
    bucket: string
}

export const getOssConfig = (): OssConfig => {
    const yamlConfig = load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8')) as YamlOssConfig
    const ossConfig = yamlConfig.oss
    const [region, accessKeyId, accessKeySecret, bucket] = ossConfig
    return {
        region: region.region,
        accessKeyId: accessKeyId.accessKeyId,
        accessKeySecret: accessKeySecret.accessKeySecret,
        bucket: bucket.bucket
    }
}

export const getApiLey = () => {
    const bailianConfig = load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8')) as YamlOssConfig
    return bailianConfig.bailian[0].apiKey
}
