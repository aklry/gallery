import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PageRequest } from '../../common/page.dto'

export class FindUserDto extends PageRequest {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户id', required: false })
    id?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户昵称', required: false })
    userName?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户账号', required: false })
    userAccount?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户角色', required: false })
    userRole?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户简介', required: false })
    userProfile?: string
}
