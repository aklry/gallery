import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteSpaceUserDto {
    @ApiProperty({ description: '空间成员id', required: true })
    @IsString()
    @IsNotEmpty()
    id: string
}
