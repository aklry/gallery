import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AiExpandPictureQueryTaskDto {
    @ApiProperty({ description: '任务ID', required: true })
    @IsString()
    @IsNotEmpty()
    taskId: string
}
