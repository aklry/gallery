import { Module } from '@nestjs/common'
import { PictureService } from './picture.service'
import { PictureController } from './picture.controller'
import { ExtractModule } from '../extract/extract.module'
import { SpaceModule } from '../space/space.module'
import { AiExpandPictureModule } from '../ai-expand-picture/ai-expand-picture.module'

@Module({
    controllers: [PictureController],
    providers: [PictureService],
    imports: [ExtractModule, SpaceModule, AiExpandPictureModule],
    exports: [PictureService]
})
export class PictureModule {}
