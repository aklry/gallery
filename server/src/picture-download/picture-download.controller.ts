import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { version } from '../config'
import { AuthGuard } from '../auth/auth.guard'
import { PictureDownloadService } from './picture-download.service'
import { CreatePictureDownloadDto } from './dto/create-picture-download.dto'
import { PictureDownloadVo } from './vo'

@Controller({
    path: 'picture-download',
    version
})
export class PictureDownloadController {
    constructor(private readonly pictureDownloadService: PictureDownloadService) {}

    @Post('/record')
    @ApiOperation({ summary: '记录图片下载' })
    @ApiResponse({ type: PictureDownloadVo })
    @UseGuards(AuthGuard)
    async recordPictureDownload(
        @Body(new ValidationPipe()) createPictureDownloadDto: CreatePictureDownloadDto,
        @Req() req: Request
    ) {
        return this.pictureDownloadService.recordPictureDownload(createPictureDownloadDto, req)
    }
}
