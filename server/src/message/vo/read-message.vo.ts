import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class ReadMessageVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '更新结果', required: true })
    data: boolean
}
