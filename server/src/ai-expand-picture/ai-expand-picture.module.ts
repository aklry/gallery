import { Module } from '@nestjs/common'
import { AiExpandPictureService } from './ai-expand-picture.service'

@Module({
    providers: [AiExpandPictureService],
    exports: [AiExpandPictureService]
})
export class AiExpandPictureModule {}
