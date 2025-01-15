import { ResponseVo } from '../../common/response.vo'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteSpaceUserVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '删除结果', required: true })
    data: boolean
}
