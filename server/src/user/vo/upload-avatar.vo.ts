import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UploadAvatarVoModel {
    @ApiProperty({ description: '头像url', required: true })
    url: string
}

export class UploadAvatarVo extends ResponseVo<UploadAvatarVoModel> {
    @ApiProperty({ description: '头像信息', type: UploadAvatarVoModel })
    data: UploadAvatarVoModel
}
