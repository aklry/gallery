import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UpdatePictureVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '更新结果' })
    data: boolean
}
