import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PermissionModule } from '../permission/permission.module'
@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [PermissionModule]
})
export class UserModule {}
