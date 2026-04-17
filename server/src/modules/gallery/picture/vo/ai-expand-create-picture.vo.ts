import { ApiProperty } from '@nestjs/swagger'
import { AiExpandPictureCreatePictureVo } from '@infra/ai/vo'
import { ResponseVo } from '@shared/common/response.vo'

export class AiExpandCreatePictureVo extends ResponseVo<AiExpandPictureCreatePictureVo> {
    @ApiProperty({ type: AiExpandPictureCreatePictureVo, required: true })
    data: AiExpandPictureCreatePictureVo
}
