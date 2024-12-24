import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceLevelVoModel {
    @ApiProperty({ description: '空间等级', required: true })
    value: number
    @ApiProperty({ description: '空间等级名称', required: true })
    text: string
    @ApiProperty({ description: '空间最大容量', required: true })
    maxSize: bigint
    @ApiProperty({ description: '空间最大数量', required: true })
    maxCount: number
}

export class SpaceLevelVo extends ResponseVo<SpaceLevelVoModel[]> {
    @ApiProperty({ description: '空间等级', type: SpaceLevelVoModel, isArray: true })
    data: SpaceLevelVoModel[]
}
