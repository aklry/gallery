import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class SpaceAnalyzeDto {
    @ApiProperty({ description: '空间id', required: false })
    @IsString()
    @IsOptional()
    spaceId?: string
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: '是否查询公开图库', required: false })
    queryPublic?: boolean
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: '全空间分析', required: false })
    queryAll?: boolean
}
