import { Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import * as md5Module from 'md5'

const md5 = md5Module as unknown as (message: string) => string
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
@Injectable()
export class ApiValidateMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const { headers, originalUrl } = req
        const filterPath: string[] = ['message/stream', 'swagger', 'swagger-json', 'sitemap.xml', 'picture']
        if (filterPath.some(path => originalUrl.includes(path))) {
            next()
            return
        }
        const { s_sign: sSign, s_t: st } = headers
        const signKey = 'aklry'
        const signature = md5(`${signKey}_${st}`)
        const signValue = Array.isArray(sSign) ? sSign[0] : sSign
        if (!sSign || !st || signature !== signValue?.toLowerCase() || Date.now() - Number(st) > 600 * 1000) {
            throw new BusinessException('签名验证失败', BusinessStatus.API_SIGN_VALIDATE_ERROR.code)
        }
        next()
    }
}
