import { ApiProperty } from '@nestjs/swagger'

import { ResponseVo } from 'src/common/response.vo'

export class DeletePictureVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '删除结果' })
    data: boolean
}
