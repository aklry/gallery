import { Global, Module } from '@nestjs/common'
import { OssService } from './oss.service'
import { UserModule } from '../user/user.module'

@Global()
@Module({
    providers: [OssService],
    imports: [UserModule]
})
export class OssModule {}
