import { Module } from '@nestjs/common'
import { PictureService } from './picture.service'
import { PictureController } from './picture.controller'
import { ExtractModule } from '../extract/extract.module'
import { SpaceModule } from '../space/space.module'

@Module({
    controllers: [PictureController],
    providers: [PictureService],
    imports: [ExtractModule, SpaceModule],
    exports: [PictureService]
})
export class PictureModule {}
