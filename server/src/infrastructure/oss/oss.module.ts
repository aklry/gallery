import { Global, Module } from '@nestjs/common'
import { OssService } from './oss.service'
import { UserModule } from '@identity/user/user.module'

@Global()
@Module({
    providers: [OssService],
    imports: [UserModule],
    exports: [OssService]
})
export class OssModule {}
