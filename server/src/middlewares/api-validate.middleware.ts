import { Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import * as md5 from 'md5'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'

@Injectable()
export class ApiValidateMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const { headers } = req
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
