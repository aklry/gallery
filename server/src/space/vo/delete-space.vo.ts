import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class DeleteSpaceVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '删除空间结果', required: true })
    data: boolean
}
