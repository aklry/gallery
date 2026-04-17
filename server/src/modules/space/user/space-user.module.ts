import { Module } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { SpaceUserController } from './space-user.controller'
import { SpaceModule } from '@space/core/space.module'
import { UserModule } from '@identity/user/user.module'
import { PermissionModule } from '@identity/permission/permission.module'

@Module({
    controllers: [SpaceUserController],
    providers: [SpaceUserService],
    exports: [SpaceUserService],
    imports: [SpaceModule, UserModule, PermissionModule]
})
export class SpaceUserModule {}
