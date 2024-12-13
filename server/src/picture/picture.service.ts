import { Injectable } from '@nestjs/common'
import { CreatePictureDto } from './dto/create-picture.dto'
import { UpdatePictureDto } from './dto/update-picture.dto'
import { extname } from 'node:path'
import { NotLoginException, UploadFailedException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { UploadPictureDto } from './dto/upload-picture.dto'
import type { Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { OssService } from '../oss/oss.service'
import { UploadPictureVoModel } from './vo/upload-picture.vo'

@Injectable()
export class PictureService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ossService: OssService
    ) {}
    create(createPictureDto: CreatePictureDto) {
        return 'This action adds a new picture'
    }

    findAll() {
        return `This action returns all picture`
    }

    findOne(id: number) {
        return `This action returns a #${id} picture`
    }

    update(id: number, updatePictureDto: UpdatePictureDto) {
        return `This action updates a #${id} picture`
    }

    remove(id: number) {
        return `This action removes a #${id} picture`
    }
    async uploadFile(file: Express.Multer.File, req: Request, uploadPictureDto?: UploadPictureDto) {
        this.validatePicture(file)
        const user = req.session.user
        if (!user) {
            throw new NotLoginException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        let pictureId: string | undefined = undefined
        if (uploadPictureDto && uploadPictureDto.id) {
            pictureId = uploadPictureDto.id
            // 判断图片是否存在
            const picture = await this.prismaService.picture.findUnique({
                where: {
                    id: pictureId
                }
            })
            if (!picture) {
                throw new UploadFailedException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
            }
        }
        // 上传图片
        const ossResult = await this.ossService.uploadFile(file.originalname, file.buffer)
        const picture = pictureId
            ? await this.prismaService.picture.update({
                  where: {
                      id: pictureId
                  },
                  data: {
                      url: ossResult.url,
                      picScale: ossResult.picScale,
                      picSize: BigInt(ossResult.fileSize),
                      picFormat: ossResult.format,
                      picWidth: Number(ossResult.width),
                      picHeight: Number(ossResult.height),
                      name: ossResult.filename,
                      editTime: new Date(),
                      userId: user?.id || ''
                  }
              })
            : await this.prismaService.picture.create({
                  data: {
                      url: ossResult.url,
                      picScale: ossResult.picScale,
                      picSize: BigInt(ossResult.fileSize),
                      picFormat: ossResult.format,
                      picWidth: Number(ossResult.width),
                      picHeight: Number(ossResult.height),
                      name: ossResult.filename,
                      userId: user?.id || '',
                      tags: '',
                      category: '',
                      introduction: ''
                  }
              })
        if (!picture) {
            throw new UploadFailedException('图片上传失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return {
            url: picture.url,
            picScale: picture.picScale,
            format: picture.picFormat,
            fileSize: picture.picSize,
            width: picture.picWidth,
            height: picture.picHeight,
            filename: picture.name
        } as UploadPictureVoModel
    }

    validatePicture(file: Express.Multer.File) {
        if (!file) {
            throw new UploadFailedException('图片不能为空', BusinessStatus.OPERATION_ERROR.code)
        }
        const ext = extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== 'webp') {
            throw new UploadFailedException('图片格式错误', BusinessStatus.OPERATION_ERROR.code)
        }
        const maxSize = 2 * 1024 * 1024 // 2MB in bytes
        if (file.size > maxSize) {
            throw new UploadFailedException('图片大小不能超过2M', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }
}
