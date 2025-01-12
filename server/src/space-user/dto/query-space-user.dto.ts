import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { SpaceRole } from '@prisma/client'

export class QuerySpaceUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: '空间用户id',
        required: false
    })
    id?: string
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: '用户id',
        required: false
    })
    userId?: string
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: '空间id',
        required: false
    })
    spaceId?: string
    @IsOptional()
    @IsEnum(SpaceRole)
    @ApiProperty({
        description: '空间角色',
        enum: SpaceRole,
        required: false
    })
    spaceRole?: SpaceRole
}
