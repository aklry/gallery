import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
import { MessageStatus } from '@prisma/client'
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
