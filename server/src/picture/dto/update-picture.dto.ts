import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdatePictureDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片名称', required: true })
    name: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片介绍', required: true })
    introduction: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: '图片标签', required: true })
    tags: string[]
    @ApiProperty({ description: '图片url', required: false })
    @IsString()
    @IsOptional()
    url?: string
    @ApiProperty({ description: '缩略图url', required: false })
    @IsString()
    @IsOptional()
    thumbnailUrl?: string
}
