import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

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
}