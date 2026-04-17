import { ApiProperty } from '@nestjs/swagger'
import { AiGeneratePictureVo } from '@infra/ai/vo'
import { ResponseVo } from '@shared/common/response.vo'

export class AiGenerateImageCreateTaskVo extends ResponseVo<AiGeneratePictureVo> {
    @ApiProperty({ type: AiGeneratePictureVo, required: true })
    data: AiGeneratePictureVo
}
