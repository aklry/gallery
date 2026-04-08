import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdatePictureDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片id', required: true })
    id: string
    @IsString()
    @IsNotEmpty({ message: '图片名称不能为空' })
    @ApiProperty({ description: '图片名称', required: true })
    name: string
    @IsString()
    @IsNotEmpty({ message: '图片简介不能为空' })
    @ApiProperty({ description: '图片介绍', required: true })
    introduction: string
    @IsString()
    @IsNotEmpty({ message: '图片分类不能为空' })
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    @IsArray()
    @IsNotEmpty({ message: '图片标签不能为空' })
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
