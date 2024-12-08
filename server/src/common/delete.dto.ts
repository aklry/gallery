import { ApiProperty } from '@nestjs/swagger'

export class DeleteRequest {
    @ApiProperty({ description: '需要删除的对象的id' })
    id: string
}
