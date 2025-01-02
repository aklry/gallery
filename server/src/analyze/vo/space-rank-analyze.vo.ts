import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceRankAnalyzeModelVo {
    @ApiProperty({ description: '空间id', required: true })
    id: string
    @ApiProperty({ description: '空间名称', required: true })
    spaceName: string
    @ApiProperty({ description: '空间大小', required: true })
    totalSize: bigint
    @ApiProperty({ description: '用户id', required: true })
    userId: string
}

export class SpaceRankAnalyzeVo extends ResponseVo<SpaceRankAnalyzeModelVo> {
    @ApiProperty({ description: '空间排行', required: true })
    data: SpaceRankAnalyzeModelVo
}
