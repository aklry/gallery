import { ApiProperty } from '@nestjs/swagger'

class TaskMetrics {
    @ApiProperty({ type: Number, required: true })
    TOTAL: number
    @ApiProperty({ type: Number, required: true })
    SUCCEEDED: number
    @ApiProperty({ type: Number, required: true })
    FAILED: number
}

type TaskStatus = 'SUCCEEDED' | 'RUNNING' | 'FAILED'

class QueryOutput {
    @ApiProperty({ type: String, required: true })
    task_id: string
    @ApiProperty({ type: String, required: true })
    task_status: TaskStatus
    @ApiProperty({ type: String, required: false })
    submit_time?: string
    @ApiProperty({ type: String, required: false })
    scheduled_time?: string
    @ApiProperty({ type: String, required: false })
    end_time?: string
    @ApiProperty({ type: String, required: false })
    output_image_url?: string
    @ApiProperty({ type: TaskMetrics, required: false })
    task_metrics?: TaskMetrics
    @ApiProperty({ type: String, required: false })
    code?: string
    @ApiProperty({ type: String, required: false })
    message?: string
}
class Usage {
    @ApiProperty({ type: Number, required: true })
    image_count: number
}
export class AiExpandPictureQueryPictureVo {
    @ApiProperty({ type: String, required: true })
    request_id: string
    @ApiProperty({ type: QueryOutput, required: true })
    output: QueryOutput
    @ApiProperty({ type: Usage, required: false })
    usage?: Usage
}
