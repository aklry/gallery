import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as OSS from 'ali-oss'
import { getOssConfig } from '../utils'
import { extname } from 'node:path'
import { OSS_PUBLIC_PICTURE_PATH, BusinessStatus } from '../config'
import type { Request } from 'express'
import { NotLoginException, UploadFailedException } from '../custom-exception'

@Injectable()
export class OssService {
    private ossClient: OSS
    constructor(private readonly userService: UserService) {
        const config = getOssConfig()
        this.ossClient = new OSS({
            region: config.region,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucket
        })
    }
    async uploadFile(filename: string, fileBuffer: Buffer, req: Request) {
        try {
            const ext = extname(filename)
            const uploadFileName = `${OSS_PUBLIC_PICTURE_PATH}/${Date.now()}-${Math.random() * 1e19}${ext}`
            const loginUser = await this.userService.getLoginUser(req)
            if (!loginUser) {
                throw new NotLoginException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
            }
            const result = await this.ossClient.put(uploadFileName, fileBuffer)
            return result.url
        } catch (error) {
            throw new UploadFailedException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
