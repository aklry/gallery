import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class PictureLikeVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '点赞状态', type: Boolean })
    data: boolean
}
