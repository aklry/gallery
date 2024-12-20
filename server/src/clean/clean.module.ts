import { Module } from '@nestjs/common'
import { CleanService } from './clean.service'
import { PictureModule } from '../picture/picture.module'

@Module({
    providers: [CleanService],
    exports: [CleanService],
    imports: [PictureModule]
})
export class CleanModule {}
