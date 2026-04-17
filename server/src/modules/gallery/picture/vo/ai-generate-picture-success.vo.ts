import { ApiProperty } from '@nestjs/swagger'
import { AiGeneratePictureSuccessVo } from '@infra/ai/vo'
import { ResponseVo } from '@shared/common/response.vo'

export class AiGenerateImageSuccessVo extends ResponseVo<AiGeneratePictureSuccessVo> {
    @ApiProperty({ type: AiGeneratePictureSuccessVo, required: true })
    data: AiGeneratePictureSuccessVo
}
