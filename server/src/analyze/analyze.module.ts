import { Module } from '@nestjs/common'
import { AnalyzeService } from './analyze.service'
import { SpaceModule } from '../space/space.module'
import { AnalyzeController } from './analyze.controller'

@Module({
    providers: [AnalyzeService],
    imports: [SpaceModule],
    controllers: [AnalyzeController]
})
export class AnalyzeModule {}
