import { ApiProperty } from '@nestjs/swagger'

export class ResponseVo<T> {
    @ApiProperty({ description: '状态码' })
    code: number
    @ApiProperty({ description: '消息' })
    message: string
    @ApiProperty({ description: '数据' })
    data: T
    @ApiProperty({ description: '时间戳' })
    timestamp: string
    @ApiProperty({ description: '路径' })
    path: string
}
