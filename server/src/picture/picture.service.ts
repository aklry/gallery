import { UploadBatchPictureDto } from './dto/uploadBatch-picture.dto'
import { Injectable } from '@nestjs/common'
import { UpdatePictureDto } from './dto/update-picture.dto'
import { extname } from 'node:path'
import { DaoErrorException, NotLoginException, UploadFailedException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { UploadPictureDto } from './dto/upload-picture.dto'
import type { Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { OssService } from '../oss/oss.service'
import { UploadPictureVoModel } from './vo/upload-picture.vo'
import { QueryPictureDto } from './dto/query-picture.dto'
import { PictureVoModel } from './vo/picture.vo'
import { GetPictureVoModel } from './vo/get-picture.vo'
import { LoginVoModel } from '../user/vo/user-login.vo'
import { DeletePictureDto } from './dto/delete-picture.dto'
import { ExtractService } from '../extract/extract.service'

@Injectable()
export class PictureService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ossService: OssService,
        private readonly extractService: ExtractService
    ) {}

    async getPictureByPage(queryPictureDto: QueryPictureDto) {
        const { current, pageSize, searchText, ...filters } = queryPictureDto

        // Build where clause for search and filters
        const where: any = {
            ...(searchText && {
                OR: [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
            }),
            ...Object.entries(filters).reduce((acc: any, [key, value]) => {
                if (value !== undefined && key !== 'sortField' && key !== 'sortOrder') {
                    if (key === 'tags' && Array.isArray(value)) {
                        acc[key] = {
                            contains: value.map(tag => `"${tag}"`).join(',')
                        }
                    } else {
                        acc[key] = value
                    }
                }
                return acc
            }, {})
        }
        const orderBy: any = filters.sortField
            ? {
                  [filters.sortField]: filters.sortOrder || 'desc'
              }
            : undefined

        // Get paginated results and total count in parallel
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where,
                orderBy,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.picture.count({ where })
        ])
        const result: PictureVoModel[] = data.map(item => ({
            id: item.id,
            url: item.url,
            name: item.name,
            introduction: item.introduction,
            category: item.category,
            tags: item.tags === '' ? '' : JSON.parse(item.tags) || [],
            picSize: Number(item.picSize),
            picWidth: item.picWidth,
            picHeight: item.picHeight,
            picScale: item.picScale,
            picFormat: item.picFormat,
            createTime: item.createTime.toISOString(),
            userId: item.userId,
            editTime: item.editTime.toISOString()
        }))
        return {
            list: result,
            total
        }
    }

    async getPictureByPageVo(queryPictureDto: QueryPictureDto) {
        const { current, pageSize, searchText, ...filters } = queryPictureDto
        if (Number(pageSize) > 20) {
            throw new DaoErrorException(BusinessStatus.OPERATION_ERROR.message, BusinessStatus.OPERATION_ERROR.code)
        }

        // Build where clause for search and filters
        const where: any = {
            ...(searchText && {
                OR: [{ name: { contains: searchText } }, { introduction: { contains: searchText } }]
            }),
            ...Object.entries(filters).reduce((acc: any, [key, value]) => {
                if (value !== undefined && key !== 'sortField' && key !== 'sortOrder') {
                    if (key === 'tags' && Array.isArray(value)) {
                        acc[key] = {
                            contains: value.map(tag => `"${tag}"`).join(',')
                        }
                    } else {
                        acc[key] = value
                    }
                }
                return acc
            }, {})
        }
        const orderBy: any = filters.sortField
            ? {
                  [filters.sortField]: filters.sortOrder || 'desc'
              }
            : undefined

        // Get paginated results and total count in parallel
        const [data, total] = await Promise.all([
            this.prismaService.picture.findMany({
                where,
                orderBy,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.picture.count({ where })
        ])
        const result: UploadPictureVoModel[] = data.map(item => ({
            id: item.id,
            url: item.url,
            name: item.name,
            introduction: item.introduction,
            category: item.category,
            tags: item.tags === '' ? '' : JSON.parse(item.tags) || [],
            format: item.picFormat,
            fileSize: item.picSize,
            width: item.picWidth,
            height: item.picHeight,
            filename: item.name,
            picScale: item.picScale
        }))
        return {
            list: result,
            total
        }
    }

    async getById(id: string) {
        const result = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!result) {
            throw new DaoErrorException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        return {
            id: result.id,
            url: result.url,
            name: result.name,
            introduction: result.introduction,
            category: result.category,
            tags: result.tags === '' ? '' : JSON.parse(result.tags) || [],
            picSize: Number(result.picSize),
            picWidth: result.picWidth,
            picHeight: result.picHeight,
            picScale: result.picScale,
            picFormat: result.picFormat,
            createTime: result.createTime.toISOString(),
            userId: result.userId,
            editTime: result.editTime.toISOString(),
            user: {
                id: user?.id,
                userAccount: user?.userAccount,
                userName: user?.userName,
                userAvatar: user?.userAvatar,
                userProfile: user?.userProfile,
                userRole: user?.userRole
            } as LoginVoModel
        } as GetPictureVoModel
    }

    async getByIdVo(id: string) {
        const result = await this.prismaService.picture.findUnique({
            where: { id }
        })
        if (!result) {
            throw new DaoErrorException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: result.userId }
        })
        return {
            id: result.id,
            url: result.url,
            name: result.name,
            introduction: result.introduction,
            category: result.category,
            tags: result.tags === '' ? '' : JSON.parse(result.tags) || [],
            picSize: Number(result.picSize),
            picWidth: result.picWidth,
            picHeight: result.picHeight,
            picScale: result.picScale,
            picFormat: result.picFormat,
            createTime: result.createTime.toISOString(),
            userId: result.userId,
            editTime: result.editTime.toISOString(),
            user: {
                id: user?.id,
                userAccount: user?.userAccount,
                userName: user?.userName,
                userAvatar: user?.userAvatar,
                userProfile: user?.userProfile,
                userRole: user?.userRole
            } as LoginVoModel
        } as GetPictureVoModel
    }

    async delete(deletePicture: DeletePictureDto, req: Request) {
        const { id } = deletePicture
        const user = req.session.user
        const userId = user.id
        const oldPicture = await this.getById(id)
        if (!oldPicture) {
            throw new DaoErrorException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        if (oldPicture.user.id !== userId) {
            throw new DaoErrorException('图片不属于当前用户', BusinessStatus.OPERATION_ERROR.code)
        }
        const result = await this.prismaService.picture.delete({
            where: { id }
        })
        if (!result) {
            throw new DaoErrorException('图片删除失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
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
            id: picture.id,
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

    async update(updatePictureDto: UpdatePictureDto) {
        const { id, ...rest } = updatePictureDto
        const oldPicture = await this.getById(id)
        if (!oldPicture) {
            throw new DaoErrorException('图片不存在', BusinessStatus.OPERATION_ERROR.code)
        }
        const result = await this.prismaService.picture.update({
            where: { id },
            data: {
                ...rest,
                tags: JSON.stringify(rest.tags)
            }
        })
        if (!result) {
            throw new DaoErrorException('图片更新失败', BusinessStatus.OPERATION_ERROR.code)
        }
        return true
    }

    async uploadBatch(uploadBatchPictureDto: UploadBatchPictureDto, req: Request) {
        const { keywords, count } = uploadBatchPictureDto
        const url = `https://cn.bing.com/images/async?q=${keywords}&mmasync=1`
        const html = await this.extractService.fetchHtml(url)
        const data = await this.extractService.extractImage(html, count)
        if (data.length === 0) {
            throw new UploadFailedException('图片链接不能为空', BusinessStatus.OPERATION_ERROR.code)
        }
        let uploadCount = 0
        const fileResult: UploadPictureVoModel[] = []
        for (const url of data) {
            try {
                const file = await this.ossService.uploadFile(url, null)
                uploadCount++
                fileResult.push(file)
            } catch (error) {
                console.log('图片上传失败')
                continue
            }
        }
        return {
            count: uploadCount,
            list: fileResult
        }
    }
    async setPicture(picture: UploadPictureVoModel[], req: Request) {
        const user = req.session.user
        if (!user) {
            throw new NotLoginException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        await this.prismaService.picture.createMany({
            data: picture.map(item => ({
                url: item.url,
                name: item.filename,
                userId: user.id,
                introduction: '',
                category: '',
                tags: '',
                picSize: BigInt(item.fileSize),
                picWidth: item.width,
                picHeight: item.height,
                picScale: item.picScale,
                picFormat: item.format
            }))
        })
    }
}
