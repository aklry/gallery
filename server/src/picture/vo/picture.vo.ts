import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
export class PictureVoModel {
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @ApiProperty({ description: '图片url', required: true })
    url: string
    @ApiProperty({ description: '图片名称', required: true })
    name: string
    @ApiProperty({ description: '图片简介', required: true })
    introduction: string
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    @ApiProperty({ description: '图片标签', required: true })
    tags: string[]
    @ApiProperty({ description: '图片尺寸', required: true })
    picSize: number
    @ApiProperty({ description: '图片宽度', required: true })
    picWidth: number
    @ApiProperty({ description: '图片高度', required: true })
    picHeight: number
    @ApiProperty({ description: '图片比例', required: true })
    picScale: number
    @ApiProperty({ description: '图片格式', required: true })
    picFormat: string
    @ApiProperty({ description: '创建时间', required: true })
    createTime: string
    @ApiProperty({ description: '用户id', required: true })
    userId: string
    @ApiProperty({ description: '审核状态', required: true })
    reviewStatus: number
    @ApiProperty({ description: '审核时间', required: true })
    reviewTime: string
    @ApiProperty({ description: '审核信息', required: true })
    reviewMessage: string
}

export class PictureVoType {
    @ApiProperty({ description: '图片信息', type: [PictureVoModel] })
    list: PictureVoModel[]
    @ApiProperty({ description: '总数' })
    total: number
}

export class PictureVo extends ResponseVo<PictureVoType> {
    @ApiProperty({ description: '图片信息', type: PictureVoType })
    data: PictureVoType
}
