import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePictureDto {
    @IsString()
    @ApiProperty({ description: '图片id', required: true })
    id: string
}
