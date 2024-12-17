import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { getOssConfig } from '../utils'
import { extname } from 'node:path'
import { OSS_PUBLIC_PICTURE_PATH, BusinessStatus, OSS_PICTURE_PATH } from '../config'
import { UploadFailedException } from '../custom-exception'
import { UploadPictureVo, UploadPictureVoModel } from '../picture/vo/upload-picture.vo'
interface ImageInfo {
    ImageWidth: {
        value: number
    }
    ImageHeight: {
        value: number
    }
    Format: {
        value: string
    }
    FileSize: {
        value: string
    }
}
@Injectable()
export class OssService {
    private ossClient: OSS
    constructor() {
        const config = getOssConfig()
        this.ossClient = new OSS({
            region: config.region,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucket
        })
    }
    async uploadFile(filename: string, fileBuffer: Buffer, prefix: string = OSS_PUBLIC_PICTURE_PATH) {
        try {
            const ext = extname(filename)
            const uploadFileName = `${OSS_PICTURE_PATH}/${prefix}/${Date.now()}-${Math.random() * 1e19}${ext}`
            const result = await this.ossClient.put(uploadFileName, fileBuffer)
            const imageInfo = await this.ossClient.get(uploadFileName, {
                process: 'image/info'
            })
            const info = JSON.parse(imageInfo.content.toString()) as ImageInfo
            const picScale = Number((info.ImageWidth.value / info.ImageHeight.value).toFixed(2))
            return {
                url: result.url,
                picScale,
                format: info.Format.value,
                fileSize: BigInt(info.FileSize.value),
                width: info.ImageWidth.value,
                height: info.ImageHeight.value,
                filename: filename
            } as UploadPictureVoModel
        } catch (error) {
            throw new UploadFailedException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }
}
