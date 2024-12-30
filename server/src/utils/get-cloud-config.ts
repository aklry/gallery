import * as fs from 'node:fs'
import * as path from 'node:path'
import { load } from 'js-yaml'

interface YamlOssConfig {
    oss: string[]
    bailian: BailianConfig[]
}

interface OssConfig {
    bucket: string
    region: string
    accessKeyId: string
    accessKeySecret: string
}

interface BailianConfig {
    apiKey: string
}

export const getOssConfig = (): OssConfig => {
    const ossConfig = load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8')) as YamlOssConfig
    return ossConfig.oss.reduce((prev, cur) => {
        const [key, value] = cur.split(':')
        prev[key] = value
        return prev
    }, {}) as OssConfig
}

export const getApiLey = () => {
    const bailianConfig = load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8')) as YamlOssConfig
    return bailianConfig.bailian[0].apiKey
}
