import { ApiProperty } from '@nestjs/swagger'
import { AiExpandPictureCreatePictureVo } from '../../ai-expand-picture/vo'
import { ResponseVo } from '../../common/response.vo'

export class AiExpandCreatePictureVo extends ResponseVo<AiExpandPictureCreatePictureVo> {
    @ApiProperty({ type: AiExpandPictureCreatePictureVo, required: true })
    data: AiExpandPictureCreatePictureVo
}
