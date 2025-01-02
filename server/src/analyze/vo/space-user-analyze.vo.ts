import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceUserAnalyzeModelVo {
    @ApiProperty({ description: '时间维度', required: true })
    period: string
    @ApiProperty({ description: '图片数量', required: true })
    count: number
}

export class SpaceUserAnalyzeVo extends ResponseVo<SpaceUserAnalyzeModelVo> {
    @ApiProperty({ description: '用户上传分析结构', required: true })
    data: SpaceUserAnalyzeModelVo
}
