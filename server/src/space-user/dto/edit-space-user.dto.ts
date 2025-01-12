import { ApiProperty } from '@nestjs/swagger'
import { SpaceRole } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class EditSpaceUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '空间用户id'
    })
    id: string
    @IsNotEmpty()
    @IsEnum(SpaceRole)
    @ApiProperty({
        description: '空间角色',
        enum: SpaceRole
    })
    spaceRole: SpaceRole
}
