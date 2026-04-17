import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
export class DeleteRequest {
    @ApiProperty({ description: '需要删除的对象的id' })
    @IsNotEmpty()
    @IsString()
    id: string
}
