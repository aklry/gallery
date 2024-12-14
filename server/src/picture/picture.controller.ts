import { Controller, Get, Post, Body, Param, Req, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common'
import { PictureService } from './picture.service'
import type { Request } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadPictureDto } from './dto/upload-picture.dto'
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
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
    async getPictureByPage(@Body(new ValidationPipe()) queryPictureDto: QueryPictureDto) {
        const data = await this.pictureService.getPictureByPage(queryPictureDto)
        return this.responseService.success(data)
    }

    @Post('/list/page/vo')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiResponse({ type: PictureVo })
    async getPictureByPageVo(@Body(new ValidationPipe()) queryPictureDto: QueryPictureDto) {
        const data = await this.pictureService.getPictureByPageVo(queryPictureDto)
        return this.responseService.success(data)
    }

    @Get('/get/:id')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiResponse({ type: GetPictureVo })
    async getById(@Param('id') id: string) {
        const result = await this.pictureService.getById(id)
        return this.responseService.success(result)
    }

    @Get('/get/vo/:id')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: GetPictureVo })
    async getByIdVo(@Param('id') id: string) {
        const result = await this.pictureService.getByIdVo(id)
        return this.responseService.success(result)
    }

    @Post('/delete')
    @ApiResponse({ type: DeletePictureVo })
    async deletePicture(@Body() deletePictureDto: DeletePictureDto, @Req() req: Request) {
        const data = await this.pictureService.delete(deletePictureDto, req)
        return this.responseService.success(data)
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ type: UploadPictureVo })
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiBody({
        description: '上传图片',
        schema: {
            type: 'object',
            properties: {
                file: { type: 'file', format: 'binary' },
                id: { type: 'string' }
            }
        }
    })
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() uploadPictureDto?: UploadPictureDto
    ) {
        const data = await this.pictureService.uploadFile(file, req, uploadPictureDto)
        return this.responseService.success(data)
    }

    @Post('/update')
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiResponse({ type: UpdatePictureVo })
    async updatePicture(@Body(new ValidationPipe()) updatePictureDto: UpdatePictureDto) {
        const data = await this.pictureService.update(updatePictureDto)
        return this.responseService.success(data)
    }
    @Get('/tag_category')
    @ApiResponse({ type: TagCategoryListVo })
    listPictureTagCategory() {
        const tags = ['热门', '搞笑', '生活', '高清', '艺术', '校园', '背景', '简历', '创意']
        const category = ['模板', '电商', '表情包', '素材', '海报']
        return this.responseService.success({ tagList: tags, categoryList: category })
    }
}
