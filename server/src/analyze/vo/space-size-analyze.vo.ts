import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceSizeModelVo {
    @ApiProperty({ description: '图片大小范围', required: true })
    sizeRange: string
    @ApiProperty({ description: '图片数量', required: true })
    count: number
}

export class SpaceSizeAnalyzeVo extends ResponseVo<SpaceSizeModelVo> {
    @ApiProperty({ description: '图片大小分析结果', required: true })
    data: SpaceSizeModelVo
}
