import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UserLogoutVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '是否登出成功', type: Boolean })
    data: boolean
}
