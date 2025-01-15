import { ResponseVo } from '../../common/response.vo'
import { ApiProperty } from '@nestjs/swagger'

export class AddSpaceUserVo extends ResponseVo<string> {
    @ApiProperty({ description: '添加的空间成员id', required: true })
    data: string
}
