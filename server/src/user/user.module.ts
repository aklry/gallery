import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PermissionModule } from '../permission/permission.module'
import { EmailModule } from '../email/email.module'
@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [PermissionModule, EmailModule]
})
export class UserModule {}
