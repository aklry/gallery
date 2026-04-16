import { Module } from '@nestjs/common'
import { PictureService } from './picture.service'
import { PictureController } from './picture.controller'
import { ExtractModule } from '../extract/extract.module'
import { SpaceModule } from '../space/space.module'
import { PermissionModule } from '../permission/permission.module'
import { AiModule } from '../ai/ai.module'
import { SseModule } from '../sse/sse.module'

@Module({
    controllers: [PictureController],
    providers: [PictureService],
    imports: [ExtractModule, SpaceModule, PermissionModule, AiModule, SseModule],
    exports: [PictureService]
})
export class PictureModule {}
