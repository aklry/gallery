import { SpaceAnalyzeDto } from './space-analyze.dto'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SpaceUserAnalyzeDto extends SpaceAnalyzeDto {
    @IsString()
    @ApiProperty({ description: '用户id', required: true })
    userId: string
    @IsString()
    @ApiProperty({ description: '时间维度', required: true })
    timeDimension: string
}
