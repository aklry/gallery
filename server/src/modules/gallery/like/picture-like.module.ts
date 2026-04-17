import { Module } from '@nestjs/common'
import { PictureLikeService } from './picture-like.service'
import { PictureLikeController } from './picture-like.controller'

@Module({
    controllers: [PictureLikeController],
    providers: [PictureLikeService]
})
export class PictureLikeModule {}
