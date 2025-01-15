import { Module } from '@nestjs/common'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { PermissionGuard } from './permission.guard'

@Module({
    providers: [SpaceUserAuthManager, PermissionGuard],
    exports: [SpaceUserAuthManager, PermissionGuard]
})
export class PermissionModule {}
