import { Module } from '@nestjs/common'
import { PictureDownloadService } from './picture-download.service'
import { PictureDownloadController } from './picture-download.controller'

@Module({
    controllers: [PictureDownloadController],
    providers: [PictureDownloadService]
})
export class PictureDownloadModule {}
