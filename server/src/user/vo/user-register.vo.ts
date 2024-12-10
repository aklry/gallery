import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UserRegisterVo extends ResponseVo<string> {
    @ApiProperty({ description: '用户ID', type: String })
    data: string
}
