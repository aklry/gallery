import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

import { IsString } from 'class-validator'

export class UploadPictureDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片id(用于修改)', required: false })
    id?: string
}
