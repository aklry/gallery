import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PageRequest } from '../../common/page.dto'

export class FindUserDto extends PageRequest {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户id' })
    id?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户昵称' })
    userName?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户账号' })
    userAccount?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户角色' })
    userRole?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户简介' })
    userProfile?: string
}
