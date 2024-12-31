import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceCategoryAnalyzeModelVo {
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    @ApiProperty({ description: '图片数量', required: true })
    count: number
    @ApiProperty({ description: '分类图片总大小', required: true })
    totalSize: bigint
}

export class SpaceCategoryAnalyzeVo extends ResponseVo<SpaceCategoryAnalyzeModelVo> {
    @ApiProperty({ description: '图片分类统计数据', required: true, type: SpaceCategoryAnalyzeModelVo })
    data: SpaceCategoryAnalyzeModelVo
}
