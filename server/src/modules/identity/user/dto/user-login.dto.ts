import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator'

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
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '登录验证码' })
    code: string
}

export class UserLoginByEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: '用户邮箱' })
    userEmail: string
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({ description: '用户密码' })
    userPassword: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '登录验证码' })
    code: string
}
