import * as Joi from 'joi'

export const envConfigSchema = Joi.object({
    DATABASE_URL: Joi.string().trim().required(),
    CORS: Joi.string().trim().required(),
    ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().port().default(3000),
    REDIS_PASSWORD: Joi.string().allow('').default(''),
    TRUST_PROXY_HOPS: Joi.number().integer().min(0).default(0)
})
