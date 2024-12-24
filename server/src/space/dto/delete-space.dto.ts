import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteSpaceDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '空间ID', required: true })
    id: string
}
