import { ApiProperty } from '@nestjs/swagger'

export class PageRequest {
    @ApiProperty({ description: '当前页' })
    current: number
    @ApiProperty({ description: '每页条数' })
    pageSize: number
    @ApiProperty({ description: '排序字段' })
    sort?: string
    @ApiProperty({ description: '排序方式' })
    sortOrder?: string
}
