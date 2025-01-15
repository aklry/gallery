import { Module } from '@nestjs/common'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'

@Module({
    providers: [SpaceUserAuthManager],
    exports: [SpaceUserAuthManager]
})
export class PermissionModule {}
