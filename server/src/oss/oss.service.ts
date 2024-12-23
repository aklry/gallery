import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { getOssConfig, isValidUrl } from '../utils'
import { extname } from 'node:path'
import {
    OSS_PUBLIC_PICTURE_PATH,
    BusinessStatus,
    OSS_PICTURE_PATH,
    OSS_IMAGE_DOMAIN,
    OSS_PREVIOUS_IMAGE_DOMAIN,
    OSS_SPACE_PICTURE_PATH
} from '../config'
import { BusinessException } from '../custom-exception'
import { UploadPictureVoModel } from '../picture/vo/upload-picture.vo'
import axios from 'axios'
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
            let ext = ''
            const isUrl = isValidUrl(filename)
            if (isUrl) {
                const response = await axios.get(filename, { responseType: 'arraybuffer' })
                fileBuffer = Buffer.from(response.data, 'binary')
                // Get content type from response headers
                const contentType = response.headers['content-type']
                if (contentType) {
                    const extension = contentType.split('/')[1]
                    if (['jpeg', 'jpg', 'png', 'webp'].includes(extension)) {
                        ext = `.${extension}`
                    } else {
                        throw new BusinessException('不支持的图片格式', BusinessStatus.OPERATION_ERROR.code)
                    }
                }
            } else {
                ext = extname(filename)
            }
            // 生成唯一的文件名
            const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
            const uploadFileName = `${prefix === 'space' ? OSS_SPACE_PICTURE_PATH : OSS_PICTURE_PATH}/${uniqueId}${ext}`

            // 上传原始图片
            const result = await this.ossClient.put(uploadFileName, fileBuffer, {
                headers: {
                    'Content-Disposition': `attachment; filename="${isUrl ? uploadFileName.split('/').pop() : filename}"`
                }
            })

            // 生成缩略图
            const thumbnailOptions = {
                process: 'image/auto-orient,1/resize,p_80/quality,q_80/format,webp',
                responseType: 'arraybuffer'
            }
            const compressedImage = await this.ossClient.get(uploadFileName, thumbnailOptions)

            // 上传缩略图
            const thumbFileName = `${uploadFileName.replace(ext, '')}-thumb.webp`
            const thumbResult = await this.ossClient.put(thumbFileName, compressedImage.content, {
                headers: {
                    'Content-Type': 'image/webp'
                }
            })

            // 获取图片信息
            const imageInfo = await this.ossClient.get(thumbFileName, { process: 'image/info' })
            const info = JSON.parse(imageInfo.content.toString()) as ImageInfo

            // 计算图片比例并格式化URL
            const picScale = Number((info.ImageWidth.value / info.ImageHeight.value).toFixed(2))
            const url = result.url.replace(OSS_PREVIOUS_IMAGE_DOMAIN, OSS_IMAGE_DOMAIN)
            const thumbUrl = thumbResult.url.replace(OSS_PREVIOUS_IMAGE_DOMAIN, OSS_IMAGE_DOMAIN)
            return {
                url,
                picScale,
                format: info.Format.value,
                fileSize: BigInt(info.FileSize.value),
                width: info.ImageWidth.value,
                height: info.ImageHeight.value,
                filename: isUrl ? uploadFileName.split('/').pop().split('-').pop() : filename,
                thumbnailUrl: thumbUrl
            } as UploadPictureVoModel
        } catch (error) {
            throw new BusinessException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }
    }

    getOssClient(): OSS {
        return this.ossClient
    }

    generateTempFile() {}

    getOssPathFromUrl(url: string): string {
        try {
            const urlObj = new URL(url)
            return urlObj.pathname.substring(1)
        } catch (error) {
            throw new Error('Invalid OSS URL')
        }
    }
}
