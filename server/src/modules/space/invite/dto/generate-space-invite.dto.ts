import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

export class GenerateSpaceInviteDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '空间 id'
    })
    spaceId: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(30)
    @ApiPropertyOptional({
        description: '有效时长，单位分钟，默认 15，最大 30',
        minimum: 1,
        maximum: 30,
        default: 15
    })
    expireMinutes?: number
}
