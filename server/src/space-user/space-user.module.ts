import { Module } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { SpaceUserController } from './space-user.controller'
import { SpaceModule } from '../space/space.module'
import { UserModule } from '../user/user.module'

@Module({
    controllers: [SpaceUserController],
    providers: [SpaceUserService],
    imports: [SpaceModule, UserModule]
})
export class SpaceUserModule {}
