import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class PictureCollectionVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '图片信息', type: Boolean })
    data: boolean
}
