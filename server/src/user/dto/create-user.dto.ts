import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户昵称' })
    userName?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户头像' })
    userAvatar?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户账号' })
    userAccount?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户简介' })
    userProfile?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户角色' })
    userRole?: string
}
