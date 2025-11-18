import { Module } from '@nestjs/common'
import { AiGeneratePictureService } from './ai-generate-picture.service'

@Module({
    providers: [AiGeneratePictureService],
    exports: [AiGeneratePictureService]
})
export class AiGeneratePictureModule {}
