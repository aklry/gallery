import { Module } from '@nestjs/common'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { PermissionGuard, PermissionKit } from './permission.guard'

@Module({
    providers: [SpaceUserAuthManager, PermissionKit, PermissionGuard],
    exports: [SpaceUserAuthManager, PermissionKit, PermissionGuard]
})
export class PermissionModule {}
