import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceUsageAnalyzeModelVo {
    @ApiProperty({ description: '已使用空间大小', required: true })
    usedSize: bigint
    @ApiProperty({ description: '总大小', required: true })
    maxSize: bigint | null
    @ApiProperty({ description: '空间使用比例', required: true })
    sizeUsageRatio: number | null
    @ApiProperty({ description: '当前图片数量', required: true })
    usedCount: bigint
    @ApiProperty({ description: '图片总数量', required: true })
    maxCount: bigint | null
    @ApiProperty({ description: '图片使用比例', required: true })
    countUsageRatio: number | null
}

export class SpaceUsageAnalyzeVo extends ResponseVo<SpaceUsageAnalyzeModelVo> {
    @ApiProperty({ description: '返回数据', required: true, type: SpaceUsageAnalyzeModelVo })
    data: SpaceUsageAnalyzeModelVo
}
