import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class JoinSpaceInviteDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{6}$/, {
        message: '邀请码必须为 6 位数字'
    })
    @ApiProperty({
        description: '6 位数字邀请码',
        example: '123456'
    })
    code: string
}
