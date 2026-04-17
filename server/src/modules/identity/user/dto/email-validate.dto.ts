import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class EmailValidateDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({ description: '发送验证码的邮箱' })
    userEmail: string
}
