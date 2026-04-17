import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class PictureDownloadVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '记录下载结果', type: Boolean })
    data: boolean
}
