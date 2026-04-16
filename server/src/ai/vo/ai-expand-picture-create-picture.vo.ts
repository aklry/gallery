import { ApiProperty } from '@nestjs/swagger'

class Output {
    @ApiProperty({ type: String, required: true })
    'task_status': 'PENDING' | 'RUNNING' | 'SUSPENDED' | 'SUCCEEDED' | 'FAILED' | 'UNKNOWN'
    @ApiProperty({ type: String, required: true })
    'task_id': string
}

export class AiExpandPictureCreatePictureVo {
    @ApiProperty({ type: Output, required: true })
    output?: Output
    @ApiProperty({ type: String, required: true })
    'request_id': string
    @ApiProperty({ type: String, required: true })
    code?: string
    @ApiProperty({ type: String, required: true })
    message?: string
}
