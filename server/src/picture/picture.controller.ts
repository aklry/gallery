import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common'
import { PictureService } from './picture.service'
import { CreatePictureDto } from './dto/create-picture.dto'
import { UpdatePictureDto } from './dto/update-picture.dto'
import type { Request } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadPictureDto } from './dto/upload-picture.dto'
import { ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { UploadPictureVo } from './vo/upload-picture.vo'
import { ResponseService } from '../response/response.service'
import { version } from '../config'
import { RoleGuard } from '../auth/auth.guard'
import { Roles } from '../role/role.decorator'
import { UserRole } from '../user/enum/user'

@Controller({
    path: 'picture',
    version
})
export class PictureController {
    constructor(
        private readonly pictureService: PictureService,
        private readonly responseService: ResponseService
    ) {}

    @Post()
    create(@Body() createPictureDto: CreatePictureDto) {
        return this.pictureService.create(createPictureDto)
    }

    @Get()
    findAll() {
        return this.pictureService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pictureService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
        return this.pictureService.update(+id, updatePictureDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pictureService.remove(+id)
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ type: UploadPictureVo })
    // @UseGuards(RoleGuard)
    // @Roles([UserRole.ADMIN])
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() uploadPictureDto?: UploadPictureDto
    ) {
        const data = await this.pictureService.uploadFile(file, req, uploadPictureDto)
        return this.responseService.success(data)
    }
}
