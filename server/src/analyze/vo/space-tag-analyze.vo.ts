import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceTagAnalyzeModelVo {
    @ApiProperty({ description: '标签', required: true })
    tag: string
    @ApiProperty({ description: '标签使用数量', required: true })
    count: number
}

export class SpaceTagAnalyzeVo extends ResponseVo<SpaceTagAnalyzeModelVo[]> {
    @ApiProperty({ description: '标签分析数据', required: true, type: [SpaceTagAnalyzeModelVo] })
    data: SpaceTagAnalyzeModelVo[]
}
