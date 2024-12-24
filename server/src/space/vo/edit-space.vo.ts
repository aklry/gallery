import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class EditSpaceVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '编辑空间结果', required: true })
    data: boolean
}
