import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import { PictureCollectionService } from './picture-collection.service'
import { CreatePictureCollectionDto } from './dto/create-picture-collection.dto'
import { version } from '@core/config'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PictureCollectionVo } from './vo'
import { AuthGuard } from '@identity/auth/auth.guard'

@Controller({
    path: 'picture-collection',
    version
})
export class PictureCollectionController {
    constructor(private readonly pictureCollectionService: PictureCollectionService) {}

    @Post('/favorite')
    @ApiOperation({ summary: '收藏/取消收藏图片' })
    @ApiResponse({ type: PictureCollectionVo })
    @UseGuards(AuthGuard)
    async favoritePictureCollection(
        @Body(new ValidationPipe()) createPictureCollectionDto: CreatePictureCollectionDto,
        @Req() req: Request
    ) {
        return this.pictureCollectionService.favoritePictureCollection(createPictureCollectionDto, req)
    }
}
