import { Module } from '@nestjs/common'
import { SeoController } from './seo.controller'
import { SeoService } from './seo.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [SeoController],
    providers: [SeoService]
})
export class SeoModule {}
