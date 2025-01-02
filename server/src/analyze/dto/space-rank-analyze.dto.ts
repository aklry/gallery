import { ApiProperty } from '@nestjs/swagger'

export class SpaceRankAnalyzeDto {
    @ApiProperty({ type: Number, description: '排名前几的数量', required: false, default: 10 })
    topN: number = 10
}
