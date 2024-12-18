import { ApiProperty } from '@nestjs/swagger'
import { MessageStatus } from '@prisma/client'
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator'

export class Message {
    @ApiProperty({ description: '消息ID' })
    @IsString()
    id: string

    @ApiProperty({ description: '消息内容' })
    @IsString()
    content: string

    @ApiProperty({ description: '状态', enum: MessageStatus })
    @IsEnum(MessageStatus)
    hasRead: MessageStatus

    @ApiProperty({ description: '创建时间' })
    @IsDate()
    createTime: Date

    @ApiProperty({ description: '更新时间' })
    @IsDate()
    updateTime: Date

    @ApiProperty({ description: '是否删除' })
    @IsNumber()
    isDelete: number

    @ApiProperty({ description: '用户ID' })
    @IsString()
    userId: string
}
