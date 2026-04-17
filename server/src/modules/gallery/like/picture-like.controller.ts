import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { version } from '@core/config'
import { AuthGuard } from '@identity/auth/auth.guard'
import { PictureLikeService } from './picture-like.service'
import { CreatePictureLikeDto } from './dto/create-picture-like.dto'
import { PictureLikeVo } from './vo'

@Controller({
    path: 'picture-like',
    version
})
export class PictureLikeController {
    constructor(private readonly pictureLikeService: PictureLikeService) {}

    @Post('/like')
    @ApiOperation({ summary: '点赞/取消点赞图片' })
    @ApiResponse({ type: PictureLikeVo })
    @UseGuards(AuthGuard)
    async likePicture(@Body(new ValidationPipe()) createPictureLikeDto: CreatePictureLikeDto, @Req() req: Request) {
        return this.pictureLikeService.likePicture(createPictureLikeDto, req)
    }
}
