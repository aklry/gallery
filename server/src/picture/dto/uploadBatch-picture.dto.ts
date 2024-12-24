import { IsString, IsNotEmpty, IsNumber, Max, Min, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadBatchPictureDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '关键词', required: true })
    keywords: string

    @IsNumber()
    @IsNotEmpty()
    @Max(30)
    @Min(1)
    @ApiProperty({ description: '添加数量', required: true })
    count: number

    @IsString()
    @IsOptional()
    @ApiProperty({ description: '空间id', required: false })
    spaceId?: string
}
