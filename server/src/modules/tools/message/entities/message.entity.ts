import { ApiProperty } from '@nestjs/swagger'
import { MessageStatus } from '@prisma/client'
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { MessageType } from '../enum'

export class Message {
    @ApiProperty({ description: '消息ID' })
    @IsString()
    id: string

    @ApiProperty({ description: '消息内容' })
    @IsString()
    content: string

    @ApiProperty({ description: '消息状态', enum: MessageStatus })
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

    @ApiProperty({ description: '消息标题', required: false })
    @IsOptional()
    @IsString()
    title?: string

    @ApiProperty({ description: '消息类型', enum: MessageType })
    @IsString()
    messageType: string

    @ApiProperty({ description: '处理结果', required: false })
    @IsOptional()
    @IsNumber()
    result?: number

    @ApiProperty({ description: '图片ID', required: false })
    @IsOptional()
    @IsString()
    pictureId?: string

    @ApiProperty({ description: '业务主键', required: false })
    @IsOptional()
    @IsString()
    bizId?: string

    @ApiProperty({ description: '空间ID', required: false })
    @IsOptional()
    @IsString()
    spaceId?: string

    @ApiProperty({ description: '点击跳转地址', required: false })
    @IsOptional()
    @IsString()
    actionUrl?: string

    @ApiProperty({ description: '扩展信息', required: false })
    @IsOptional()
    @IsString()
    extra?: string
}
