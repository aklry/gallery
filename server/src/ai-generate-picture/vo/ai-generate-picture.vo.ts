import { ApiProperty } from '@nestjs/swagger'

class Output {
    @ApiProperty({ type: String, required: true })
    task_id: string
    @ApiProperty({ type: String, required: true })
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'UNKNOWN'
}

export class AiGeneratePictureVo {
    @ApiProperty({ type: String, required: true })
    request_id: string
    @ApiProperty({ type: Output, required: true })
    output: Output
}

class Result {
    @ApiProperty({ type: String, required: true })
    orig_prompt: string
    @ApiProperty({ type: String, required: true })
    actual_prompt: string
    @ApiProperty({ type: String, required: true })
    url: string
}

class TaskMetrics {
    @ApiProperty({ type: Number, required: true })
    TOTAL: number
    @ApiProperty({ type: Number, required: true })
    SUCCEEDED: number
    @ApiProperty({ type: Number, required: true })
    FAILED: number
}

class SuccessOutput {
    @ApiProperty({ type: String, required: true })
    task_id: string
    @ApiProperty({ type: String, required: true })
    task_status: string
    @ApiProperty({ type: String, required: true })
    submit_time: string
    @ApiProperty({ type: String, required: true })
    scheduled_time: string
    @ApiProperty({ type: String, required: true })
    end_time: string
    @ApiProperty({ type: [Result], required: true })
    results: Result[]
    @ApiProperty({ type: TaskMetrics, required: true })
    task_metrics: TaskMetrics
}

class Usage {
    @ApiProperty({ type: Number, required: true })
    image_count: number
}

export class AiGeneratePictureSuccessVo {
    @ApiProperty({ type: String, required: true })
    request_id: string
    @ApiProperty({ type: SuccessOutput, required: true })
    output: SuccessOutput
    @ApiProperty({ type: Usage, required: true })
    usage: Usage
}
