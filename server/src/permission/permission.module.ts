import { Module } from '@nestjs/common'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { PermissionKit } from './permission.guard'

@Module({
    providers: [SpaceUserAuthManager, PermissionKit],
    exports: [SpaceUserAuthManager, PermissionKit]
})
export class PermissionModule {}
