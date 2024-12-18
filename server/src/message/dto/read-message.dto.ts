import { ApiProperty } from '@nestjs/swagger'

export class ReadMessageDto {
    @ApiProperty({ description: '消息id', required: true })
    id: string
}
