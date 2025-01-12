import { ApiProperty } from '@nestjs/swagger'
import { SpaceRole } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class AddSpaceUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '空间id'
    })
    spaceId: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '用户id'
    })
    userId: string
    @IsNotEmpty()
    @IsEnum(SpaceRole)
    @ApiProperty({
        description: '空间角色',
        enum: SpaceRole
    })
    spaceRole: SpaceRole
}
