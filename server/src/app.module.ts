import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResponseModule } from './response/response.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
    imports: [ResponseModule, PrismaModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
