import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class ShowPictureModelVo {
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @ApiProperty({ description: '图片url', required: true })
    url: string
    @ApiProperty({ description: '图片简介', required: true })
    introduction: string
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    @ApiProperty({ description: '图片标签', required: true })
    tags: string[]
    @ApiProperty({ description: '图片格式', required: true })
    format: string
    @ApiProperty({ description: '图片大小', required: true })
    fileSize: bigint
    @ApiProperty({ description: '图片宽度', required: true })
    width: number
    @ApiProperty({ description: '图片高度', required: true })
    height: number
    @ApiProperty({ description: '图片名称', required: true })
    filename: string
    @ApiProperty({ description: '图片宽高比', required: true })
    picScale: number
    @ApiProperty({ description: '缩略图url', required: true })
    thumbnailUrl: string
}

export class ShowPictureVoType {
    @ApiProperty({ description: '图片信息', type: [ShowPictureModelVo] })
    list: ShowPictureModelVo[]
    @ApiProperty({ description: '总数' })
    total: number
}

export class ShowPictureVo extends ResponseVo<ShowPictureVoType> {
    @ApiProperty({ description: '图片信息', type: ShowPictureVoType })
    data: ShowPictureVoType
}
