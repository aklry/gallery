import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { ReviewStatus } from '../enum'

export class ReviewPictureDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @IsNumber()
    @IsNotEmpty()
    @IsEnum(ReviewStatus)
    @ApiProperty({ description: '审核状态', required: true })
    reviewStatus: ReviewStatus
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '审核消息', required: false })
    reviewMessage: string
}
