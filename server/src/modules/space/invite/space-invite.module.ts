import { Module } from '@nestjs/common'
import { PermissionModule } from '@identity/permission/permission.module'
import { SpaceModule } from '@space/core/space.module'
import { SpaceUserModule } from '@space/user/space-user.module'
import { MessageModule } from '@tools/message/message.module'
import { SpaceInviteController } from './space-invite.controller'
import { SpaceInviteService } from './space-invite.service'

@Module({
    controllers: [SpaceInviteController],
    providers: [SpaceInviteService],
    imports: [PermissionModule, SpaceModule, SpaceUserModule, MessageModule],
    exports: [SpaceInviteService]
})
export class SpaceInviteModule {}
