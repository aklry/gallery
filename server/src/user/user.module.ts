import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PermissionKit } from '../permission/permission.guard'

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [PermissionKit]
})
export class UserModule {}
