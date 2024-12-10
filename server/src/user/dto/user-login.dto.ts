import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @ApiProperty({ description: '用户账号' })
    userAccount: string
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({ description: '用户密码' })
    userPassword: string
}
