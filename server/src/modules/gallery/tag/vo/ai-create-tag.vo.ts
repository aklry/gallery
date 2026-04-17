import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class AiCreateTagVo extends ResponseVo<string[]> {
    @ApiProperty({ description: '标签列表', required: true, type: [String] })
    data: string[]
}
