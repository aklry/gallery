import { ApiProperty } from '@nestjs/swagger'
import { AiGeneratePictureSuccessVo } from '../../ai-generate-picture/vo'
import { ResponseVo } from '../../common/response.vo'

export class AiGenerateImageSuccessVo extends ResponseVo<AiGeneratePictureSuccessVo> {
    @ApiProperty({ type: AiGeneratePictureSuccessVo, required: true })
    data: AiGeneratePictureSuccessVo
}
