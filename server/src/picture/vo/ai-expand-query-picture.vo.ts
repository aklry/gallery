import { AiExpandPictureQueryPictureVo } from '../../ai-expand-picture/vo'
import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class AiExpandQueryPictureVo extends ResponseVo<AiExpandPictureQueryPictureVo> {
    @ApiProperty({ type: AiExpandPictureQueryPictureVo, required: true })
    data: AiExpandPictureQueryPictureVo
}
