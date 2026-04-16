import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagController } from './tag.controller'
import { AiModule } from '../ai/ai.module'

@Module({
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
    imports: [AiModule]
})
export class TagModule {}
