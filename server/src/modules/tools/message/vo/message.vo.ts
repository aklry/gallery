import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'
import { MessageStatus } from '@prisma/client'
import { MessageType } from '../enum'

export class MessageVoModel {
    @ApiProperty({ description: '消息id', required: true })
    id: string

    @ApiProperty({ description: '消息标题', required: true })
    title: string

    @ApiProperty({ description: '消息内容', required: true })
    content: string

    @ApiProperty({ description: '消息状态', required: true })
    hasRead: MessageStatus

    @ApiProperty({ description: '所属用户', required: true })
    userId: string

    @ApiProperty({ description: '创建时间', required: true })
    createTime: Date

    @ApiProperty({ description: '消息类型', required: true, enum: MessageType })
    messageType: MessageType

    @ApiProperty({ description: '处理结果', required: false })
    result?: number

    @ApiProperty({ description: '业务主键', required: false })
    bizId?: string

    @ApiProperty({ description: '空间id', required: false })
    spaceId?: string

    @ApiProperty({ description: '点击跳转地址', required: false })
    actionUrl?: string

    @ApiProperty({ description: '扩展信息', required: false })
    extra?: string
}

export class MessageVoType {
    @ApiProperty({ description: '消息信息', type: [MessageVoModel] })
    list: MessageVoModel[]

    @ApiProperty({ description: '总数' })
    total: number
}

export class MessageVo extends ResponseVo<MessageVoType> {
    @ApiProperty({ description: '消息信息', type: MessageVoType })
    data: MessageVoType
}
