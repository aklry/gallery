import { ResponseVo } from '../../common/response.vo'
import { ApiProperty } from '@nestjs/swagger'

export class EditSpaceUserVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '更新结果', required: true })
    data: boolean
}
