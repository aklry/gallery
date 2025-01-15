import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { PictureService } from './picture.service'
import type { Request } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import {
    AiExpandCreatePictureVo,
    AiExpandQueryPictureVo,
    DeletePictureVo,
    EditPictureBatchVo,
    GetPictureVo,
    PictureVo,
    ShowPictureVo,
    TagCategoryListVo,
    UpdatePictureVo,
    UploadBatchPictureVo,
    UploadPictureVo
} from './vo'
import { ResponseService } from '../response/response.service'
import { version } from '../config'
import { AuthGuard, RoleGuard } from '../auth/auth.guard'
import { Roles } from '../role/role.decorator'
import { Permission } from '../permission/permission.decorator'
import { UserRole } from '../user/enum/user'
import {
    AiExpandPictureDto,
    DeletePictureDto,
    EditPictureByBatchDto,
    PartialQueryPictureDto,
    QueryPictureDto,
    ReviewPictureDto,
    UpdatePictureDto,
    UploadBatchPictureDto,
    UploadPictureDto,
    UploadPictureUrlDto
} from './dto'
import { ValidationPipe } from '../pipe/validation.pipe'
import { SpaceUserPermissionConstant } from 'src/permission/SpaceUserPermissionConstant'
import { PermissionGuard } from '../permission/permission.guard'

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

    @Get('/list/color')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: ShowPictureVo })
    @ApiOperation({ summary: '根据颜色值获取相似图片' })
    async getPictureByColor(@Query('spaceId') spaceId: string, @Query('color') color: string, @Req() req: Request) {
        const data = await this.pictureService.getPictureByColor(spaceId, color, req)
        return this.responseService.success({
            list: data,
            total: data.length
        })
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
    @Permission(SpaceUserPermissionConstant.PICTURE_DELETE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '删除图片(管理员)' })
    async deletePicture(@Body(new ValidationPipe()) deletePictureDto: DeletePictureDto, @Req() req: Request) {
        const data = await this.pictureService.delete(deletePictureDto, req)
        return this.responseService.success(data)
    }

    @Post('/upload')
    @Permission(SpaceUserPermissionConstant.PICTURE_UPLOAD)
    @UseGuards(AuthGuard, PermissionGuard)
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
    @Permission(SpaceUserPermissionConstant.PICTURE_UPLOAD)
    @UseGuards(AuthGuard, PermissionGuard)
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
    @Permission(SpaceUserPermissionConstant.PICTURE_EDIT)
    @UseGuards(AuthGuard, PermissionGuard)
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

    @Post('/query')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: ShowPictureVo })
    @ApiOperation({ summary: '首页查询图片' })
    @ApiBody({
        description: '首页查询图片',
        schema: {
            type: 'object',
            properties: {
                searchText: { type: 'string' }
            }
        }
    })
    async queryPicture(@Body(new ValidationPipe()) queryPictureDto: PartialQueryPictureDto) {
        const result = await this.pictureService.queryPictureUser(queryPictureDto)
        return this.responseService.success(result)
    }

    @Post('/edit/batch')
    @ApiResponse({ type: EditPictureBatchVo })
    @Permission(SpaceUserPermissionConstant.PICTURE_EDIT)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '批量编辑图片' })
    async editPictureByBatch(@Body() editPictureByBatchDto: EditPictureByBatchDto, @Req() req: Request) {
        const result = await this.pictureService.editPictureBatch(editPictureByBatchDto, req)
        return this.responseService.success(result)
    }

    @Post('/ai/expand/create_task')
    @ApiResponse({ type: AiExpandCreatePictureVo })
    @ApiOperation({ summary: '创建扩图任务' })
    @Permission(SpaceUserPermissionConstant.PICTURE_EDIT)
    @UseGuards(AuthGuard, PermissionGuard)
    async createAiExpandPictureTask(
        @Body(new ValidationPipe()) aiExpandPictureDto: AiExpandPictureDto,
        @Req() req: Request
    ) {
        const result = await this.pictureService.createAiExpandPictureTask(aiExpandPictureDto, req)
        return this.responseService.success(result)
    }

    @Get('/ai/expand/get_task')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: AiExpandQueryPictureVo })
    @ApiOperation({ summary: '获取扩图任务' })
    async getAiExpandPictureTask(@Query('taskId') taskId: string) {
        const result = await this.pictureService.getAiExpandPictureTask(taskId)
        return this.responseService.success(result)
    }
}
