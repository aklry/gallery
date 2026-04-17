import { AiExpandPictureQueryPictureVo } from '@infra/ai/vo'
import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class AiExpandQueryPictureVo extends ResponseVo<AiExpandPictureQueryPictureVo> {
    @ApiProperty({ type: AiExpandPictureQueryPictureVo, required: true })
    data: AiExpandPictureQueryPictureVo
}
