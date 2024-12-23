import { ApiProperty } from '@nestjs/swagger'
import { SpaceLevelEnum } from '../enum'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateSpaceDto {
    @ApiProperty({ description: '空间id', required: true })
    @IsString()
    @IsNotEmpty()
    id: string
    @ApiProperty({ description: '空间名称', required: false })
    @IsString()
    @IsOptional()
    spaceName?: string
    @ApiProperty({ description: '空间等级', required: false, enum: SpaceLevelEnum })
    @IsEnum(SpaceLevelEnum)
    @IsOptional()
    spaceLevel?: SpaceLevelEnum
    @ApiProperty({ description: '空间图片最大容量', required: false })
    @IsNumber()
    @IsOptional()
    maxSize?: bigint
    @ApiProperty({ description: '空间图片最大数量', required: false })
    @IsNumber()
    @IsOptional()
    maxCount?: bigint
}
