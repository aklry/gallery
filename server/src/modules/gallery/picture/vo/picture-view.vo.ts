import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class PictureViewVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '记录浏览结果', type: Boolean })
    data: boolean
}
