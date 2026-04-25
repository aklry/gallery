import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AiEditPictureDto {
    @ApiProperty({
        description: '描述',
        required: true
    })
    @IsNotEmpty({ message: '描述不能为空' })
    prompt: string

    @ApiProperty({
        description: '图片url',
        required: true
    })
    @IsNotEmpty({ message: '图片url不能为空' })
    url: string
}
