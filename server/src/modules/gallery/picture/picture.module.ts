import { Module } from '@nestjs/common'
import { PictureService } from './picture.service'
import { PictureController } from './picture.controller'
import { ExtractModule } from '@tools/extract/extract.module'
import { SpaceModule } from '@space/core/space.module'
import { PermissionModule } from '@identity/permission/permission.module'
import { AiModule } from '@infra/ai/ai.module'
import { SseModule } from '@infra/sse/sse.module'
import { TagModule } from '@gallery/tag/tag.module'

@Module({
    controllers: [PictureController],
    providers: [PictureService],
    imports: [ExtractModule, SpaceModule, PermissionModule, AiModule, SseModule, TagModule],
    exports: [PictureService]
})
export class PictureModule {}
