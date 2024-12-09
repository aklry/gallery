import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class PageRequest {
    @ApiProperty({ description: '当前页' })
    @IsString()
    current: string
    @ApiProperty({ description: '每页条数' })
    @IsString()
    pageSize: string
    @ApiProperty({ description: '排序字段', required: false })
    @IsOptional()
    @IsString()
    sort?: string
    @ApiProperty({ description: '排序方式', required: false })
    @IsOptional()
    @IsString()
    sortOrder?: string
}
