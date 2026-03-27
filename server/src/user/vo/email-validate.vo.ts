import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class EmailValidateVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '是否发送成功', type: Boolean })
    data: boolean
}
