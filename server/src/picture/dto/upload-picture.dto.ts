import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { IsString } from 'class-validator'

export class UploadPictureDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '图片id(用于修改)' })
    id: string
}
