import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class QuitSpaceUserDto {
    @ApiProperty({ description: '空间 id', required: true })
    @IsString()
    @IsNotEmpty()
    spaceId: string
}
