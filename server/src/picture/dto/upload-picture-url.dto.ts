import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UploadPictureUrlDto {
    @ApiProperty({ description: '图片链接', required: true })
    @IsString()
    url: string
    @ApiProperty({ description: '图片id', required: false })
    @IsString()
    @IsOptional()
    id?: string
}
