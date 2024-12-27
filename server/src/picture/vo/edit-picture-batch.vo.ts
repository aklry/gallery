import { ResponseVo } from '../../common/response.vo'
import { ApiProperty } from '@nestjs/swagger'

export class EditPictureBatchVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '批量编辑结果', type: Boolean })
    data: boolean
}
