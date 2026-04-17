import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class EditSpaceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '空间id', required: true })
    id: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '空间名称', required: true })
    spaceName: string
}
