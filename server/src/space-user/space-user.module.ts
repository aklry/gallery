import { Module } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { SpaceUserController } from './space-user.controller'
import { SpaceModule } from '../space/space.module'
import { UserModule } from '../user/user.module'
import { PermissionModule } from '../permission/permission.module'

@Module({
    controllers: [SpaceUserController],
    providers: [SpaceUserService],
    exports: [SpaceUserService],
    imports: [SpaceModule, UserModule, PermissionModule]
})
export class SpaceUserModule {}
