import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UserRegisterDto {
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
    @MinLength(6)
    @ApiProperty({ description: '确认密码' })
    checkedPassword: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '滑块验证参数' })
    captchaVerifyParam: string
}

export class UserRegisterByEmailDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '邮箱' })
    userEmail: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '验证码' })
    code: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '用户密码' })
    userPassword: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '确认密码' })
    checkedPassword: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '滑块验证参数' })
    captchaVerifyParam: string
}
