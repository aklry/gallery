import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class PictureCollectionVo extends ResponseVo<null> {
    @ApiProperty({ description: '图片信息', nullable: true, example: null })
    data: null
}
