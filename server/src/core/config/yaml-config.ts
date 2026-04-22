import * as fs from 'node:fs'
import * as path from 'node:path'
import { load } from 'js-yaml'
import * as Joi from 'joi'
import type { YamlOssConfig } from '@shared/types'

const yamlConfigSchema = Joi.object<YamlOssConfig>({
    oss: Joi.object({
        region: Joi.string().trim().required(),
        accessKeyId: Joi.string().trim().required(),
        accessKeySecret: Joi.string().trim().required(),
        bucket: Joi.string().trim().required()
    }).required(),
    bailian: Joi.object({
        apiKey: Joi.string().trim().required()
    }).required(),
    email: Joi.object({
        host: Joi.string().trim().required(),
        port: Joi.number().port().required(),
        user: Joi.string().trim().required(),
        password: Joi.string().trim().required(),
        useSSL: Joi.number().valid(0, 1).required(),
        from: Joi.string()
            .trim()
            .email({ tlds: { allow: false } })
            .required()
    }).required(),
    captcha: Joi.object({
        accessKeyId: Joi.string().trim().required(),
        accessKeySecret: Joi.string().trim().required(),
        sceneId: Joi.string().trim().required()
    }).required()
}).required()

export function loadYamlConfig(): YamlOssConfig {
    const configPath = path.resolve(process.cwd(), 'config.yaml')
    const fileContent = fs.readFileSync(configPath, 'utf8')
    const parsedConfig = load(fileContent)

    if (!parsedConfig || typeof parsedConfig !== 'object' || Array.isArray(parsedConfig)) {
        throw new Error('config.yaml must be an object')
    }

    const { error, value } = yamlConfigSchema.validate(parsedConfig, {
        abortEarly: false,
        convert: true
    })

    if (error) {
        const details = error.details.map(item => item.message).join('; ')
        throw new Error(`config.yaml validation failed: ${details}`)
    }

    return value
}
