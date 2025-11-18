import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AiGeneratePictureDto {
    @ApiProperty({ description: '生成图片的文本', required: true })
    @IsString()
    @IsNotEmpty()
    text: string
}
