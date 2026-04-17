import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class AddSpaceVo extends ResponseVo<string> {
    @ApiProperty({ description: '空间ID', type: String })
    data: string
}
