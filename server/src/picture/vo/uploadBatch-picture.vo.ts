import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UploadBatchPictureVo extends ResponseVo<number> {
    @ApiProperty({ description: '上传数量', type: 'number' })
    data: number
}
