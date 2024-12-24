import { Controller, Get, Post, Body, Param, Req, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common'
import { PictureService } from './picture.service'
import type { Request } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadPictureDto } from './dto/upload-picture.dto'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UploadPictureVo } from './vo/upload-picture.vo'
import { ResponseService } from '../response/response.service'
import { version } from '../config'
import { AuthGuard, RoleGuard } from '../auth/auth.guard'
import { Roles } from '../role/role.decorator'
import { UserRole } from '../user/enum/user'
import { QueryPictureDto } from './dto/query-picture.dto'
import { PictureVo } from './vo/picture.vo'
import { ValidationPipe } from '../pipe/validation.pipe'
import { DeletePictureDto } from './dto/delete-picture.dto'
import { GetPictureVo } from './vo/get-picture.vo'
import { DeletePictureVo } from './vo/delete-picture.vo'
import { UpdatePictureDto } from './dto/update-picture.dto'
import { UpdatePictureVo } from './vo/update-picture.vo'
import { TagCategoryListVo } from './vo/tag-category.vo'
import { UploadBatchPictureDto } from './dto/uploadBatch-picture.dto'
import { UploadBatchPictureVo } from './vo/uploadBatch-picture.vo'
import { ReviewPictureDto } from './dto/review-picture.dto'
import { UploadPictureUrlDto } from './dto/upload-picture-url.dto'
import { ShowPictureVo } from './vo/show-picture.vo'

@Controller({
    path: 'picture',
    version
})
export class PictureController {
    constructor(
        private readonly pictureService: PictureService,
        private readonly responseService: ResponseService
    ) {}

    @Post('/list/page')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiResponse({ type: PictureVo })
    @ApiOperation({ summary: '获取图片列表(管理员)' })
    async getPictureByPage(@Body(new ValidationPipe()) queryPictureDto: QueryPictureDto) {
        const data = await this.pictureService.getPictureByPage(queryPictureDto)
        return this.responseService.success(data)
    }

    @Post('/list/page/vo')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: ShowPictureVo })
    @ApiOperation({ summary: '获取图片列表(非管理员)' })
    async getPictureByPageVo(@Body(new ValidationPipe()) queryPictureDto: QueryPictureDto, @Req() req: Request) {
        const data = await this.pictureService.getPictureByPageVo(queryPictureDto, req)
        return this.responseService.success(data)
    }

    @Get('/get/:id')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiResponse({ type: GetPictureVo })
    @ApiOperation({ summary: '根据id获取图片(管理员)' })
    async getById(@Param('id') id: string) {
        const result = await this.pictureService.getById(id)
        return this.responseService.success(result)
    }

    @Get('/get/vo/:id')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: GetPictureVo })
    @ApiOperation({ summary: '根据id获取图片(非管理员)' })
    async getByIdVo(@Param('id') id: string) {
        const result = await this.pictureService.getByIdVo(id)
        return this.responseService.success(result)
    }

    @Post('/delete')
    @ApiResponse({ type: DeletePictureVo })
    @ApiOperation({ summary: '删除图片(管理员)' })
    async deletePicture(@Body(new ValidationPipe()) deletePictureDto: DeletePictureDto, @Req() req: Request) {
        const data = await this.pictureService.delete(deletePictureDto, req)
        return this.responseService.success(data)
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ type: UploadPictureVo })
    @ApiOperation({ summary: '上传图片' })
    @ApiBody({
        description: '上传图片',
        schema: {
            type: 'object',
            properties: {
                file: { type: 'file', format: 'binary' },
                id: { type: 'string' },
                spaceId: { type: 'string' }
            }
        }
    })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body(new ValidationPipe()) uploadPictureDto?: UploadPictureDto
    ) {
        const data = await this.pictureService.uploadFile(file, req, uploadPictureDto)
        return this.responseService.success(data)
    }
    @Post('/upload/url')
    @ApiResponse({ type: UploadPictureVo })
    @ApiOperation({ summary: '上传图片(url)' })
    async uploadFileByUrl(@Req() req: Request, @Body(new ValidationPipe()) uploadPictureUrlDto?: UploadPictureUrlDto) {
        const data = await this.pictureService.uploadFile(uploadPictureUrlDto.url, req, uploadPictureUrlDto)
        return this.responseService.success(data)
    }

    @Post('/update')
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiResponse({ type: UpdatePictureVo })
    @ApiOperation({ summary: '更新图片(管理员)' })
    async updatePicture(@Body(new ValidationPipe()) updatePictureDto: UpdatePictureDto, @Req() req: Request) {
        const data = await this.pictureService.update(updatePictureDto, req)
        return this.responseService.success(data)
    }

    @Post('/edit')
    @ApiResponse({ type: UpdatePictureVo })
    @ApiOperation({ summary: '更新图片(非管理员)' })
    async editPicture(@Body(new ValidationPipe()) updatePictureDto: UpdatePictureDto, @Req() req: Request) {
        const data = await this.pictureService.edit(updatePictureDto, req)
        return this.responseService.success(data)
    }

    @Get('/tag_category')
    @ApiResponse({ type: TagCategoryListVo })
    @ApiOperation({ summary: '获取图片标签和分类' })
    listPictureTagCategory() {
        const tags = ['热门', '搞笑', '生活', '高清', '艺术', '校园', '背景', '简历', '创意']
        const category = ['模板', '电商', '表情包', '素材', '海报']
        return this.responseService.success({ tagList: tags, categoryList: category })
    }

    @Post('/upload/batch')
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiResponse({ type: UploadBatchPictureVo })
    @ApiOperation({ summary: '批量上传图片(管理员)' })
    async uploadBatch(@Body(new ValidationPipe()) uploadBatchPictureDto: UploadBatchPictureDto, @Req() req: Request) {
        const { count, list, spaceId } = await this.pictureService.uploadBatch(uploadBatchPictureDto, req)
        await this.pictureService.setPicture(list, spaceId, req)
        return this.responseService.success(count)
    }

    @Post('/review')
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: '审核图片(管理员)' })
    async reviewPicture(@Body(new ValidationPipe()) reviewPictureDto: ReviewPictureDto, @Req() req: Request) {
        const data = await this.pictureService.reviewPicture(reviewPictureDto, req)
        return this.responseService.success(data)
    }
}
