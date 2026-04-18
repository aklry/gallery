import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ManageSpaceInviteDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '空间 id'
    })
    spaceId: string
}
