import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class UploadPictureVoModel {
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @ApiProperty({ description: '图片url', required: true })
    url: string
    @ApiProperty({ description: '图片比例', required: true })
    picScale: number
    @ApiProperty({ description: '图片格式', required: true })
    format: string
    @ApiProperty({ description: '图片颜色', required: true })
    color: string
    @ApiProperty({ description: '图片大小', required: true })
    fileSize: bigint
    @ApiProperty({ description: '图片宽度', required: true })
    width: number
    @ApiProperty({ description: '图片高度', required: true })
    height: number
    @ApiProperty({ description: '图片名称', required: true })
    filename: string
    @ApiProperty({ description: '图片缩略图url', required: true })
    thumbnailUrl: string
    @ApiProperty({ description: '空间id', required: false })
    spaceId: string | null
}

export class UploadPictureVo extends ResponseVo<UploadPictureVoModel> {
    @ApiProperty({ description: '图片信息', type: UploadPictureVoModel })
    data: UploadPictureVoModel
}
