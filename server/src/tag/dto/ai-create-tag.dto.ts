import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AiCreateTagDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片url', required: true })
    picUrl: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '图片id', required: true })
    picId: string
}
