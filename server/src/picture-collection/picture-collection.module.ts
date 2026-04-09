import { Module } from '@nestjs/common'
import { PictureCollectionService } from './picture-collection.service'
import { PictureCollectionController } from './picture-collection.controller'

@Module({
    controllers: [PictureCollectionController],
    providers: [PictureCollectionService]
})
export class PictureCollectionModule {}
