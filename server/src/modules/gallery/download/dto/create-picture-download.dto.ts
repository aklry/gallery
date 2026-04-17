import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePictureDownloadDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '图片id', required: true })
    pictureId: string
}
