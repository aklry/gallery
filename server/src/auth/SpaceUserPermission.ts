import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SpaceUserPermission {
    @ApiProperty({ description: '权限键', example: 'space.create', required: true })
    @IsString()
    @IsNotEmpty()
    key: string
    @ApiProperty({ description: '权限名称', example: '创建空间', required: true })
    @IsString()
    @IsNotEmpty()
    name: string
    @ApiProperty({ description: '权限描述', example: '创建空间', required: true })
    @IsString()
    @IsNotEmpty()
    description: string
}
