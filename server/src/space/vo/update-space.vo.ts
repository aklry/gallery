import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UpdateSpaceVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '更新结果', type: Boolean })
    data: boolean
}
