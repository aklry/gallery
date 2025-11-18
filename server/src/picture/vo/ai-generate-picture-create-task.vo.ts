import { ApiProperty } from '@nestjs/swagger'
import { AiGeneratePictureVo } from '../../ai-generate-picture/vo'
import { ResponseVo } from '../../common/response.vo'

export class AiGenerateImageCreateTaskVo extends ResponseVo<AiGeneratePictureVo> {
    @ApiProperty({ type: AiGeneratePictureVo, required: true })
    data: AiGeneratePictureVo
}
