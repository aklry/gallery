import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

export class PageRequest {
    @ApiProperty({ description: '当前页' })
    @IsString()
    @IsNotEmpty()
    current: string
    @ApiProperty({ description: '每页条数' })
    @IsString()
    @IsNotEmpty()
    pageSize: string
    @ApiProperty({ description: '排序字段', required: false })
    @IsOptional()
    @IsString()
    sortField?: string
    @ApiProperty({ description: '排序方式', required: false })
    @IsOptional()
    @IsString()
    sortOrder?: string
}
