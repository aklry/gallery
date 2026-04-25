import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class AiEditPictureVo extends ResponseVo<string[]> {
    @ApiProperty({
        description: '图片列表',
        type: [String]
    })
    data: string[]
}
