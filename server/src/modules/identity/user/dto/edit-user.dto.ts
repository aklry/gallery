import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class EditUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '用户id' })
    id: string
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
    @ApiProperty({ description: '用户简介' })
    userProfile?: string
    @IsOptional()
    @IsString()
    @ApiProperty({ description: '用户密码' })
    userPassword?: string
}
