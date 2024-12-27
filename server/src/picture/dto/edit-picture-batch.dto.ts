import { ApiProperty } from '@nestjs/swagger'

export class EditPictureByBatchDto {
    @ApiProperty({ description: '图片id列表', required: true })
    idList: string[]
    @ApiProperty({ description: '空间id', required: true })
    spaceId: string
    @ApiProperty({ description: '图片类别', required: false })
    category?: string
    @ApiProperty({ description: '图片标签', required: false })
    tags?: string[]
    @ApiProperty({ description: '命名规则', required: false, example: 'picture{index}' })
    nameRule?: string
}
