import { Module } from '@nestjs/common'
import { SpaceService } from './space.service'
import { SpaceController } from './space.controller'
import { PermissionModule } from '@identity/permission/permission.module'

@Module({
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [SpaceService],
    imports: [PermissionModule]
})
export class SpaceModule {}
