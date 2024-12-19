import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class ReadAllMessageVo extends ResponseVo<boolean> {
    @ApiProperty({
        description: '是否成功',
        example: true,
        required: true
    })
    data: boolean
}
