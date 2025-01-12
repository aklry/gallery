import { ApiProperty } from '@nestjs/swagger'
import { SpaceLevelEnum } from '../enum'

export class Space {
    @ApiProperty({ description: '空间ID' })
    id: string
    @ApiProperty({ description: '空间名称' })
    spaceName?: string
    @ApiProperty({ description: '空间等级', enum: SpaceLevelEnum })
    spaceLevel?: SpaceLevelEnum
    @ApiProperty({ description: '最大容量' })
    maxSize?: bigint
    @ApiProperty({ description: '最大数量' })
    maxCount?: bigint
    @ApiProperty({ description: '总容量' })
    totalSize?: bigint
    @ApiProperty({ description: '总数量' })
    totalCount?: bigint
    @ApiProperty({ description: '用户ID' })
    userId: string
    @ApiProperty({ description: '空间类型' })
    spaceType: number
    @ApiProperty({ description: '创建时间' })
    createTime: Date
    @ApiProperty({ description: '编辑时间' })
    editTime: Date
    @ApiProperty({ description: '更新时间' })
    updateTime: Date
    @ApiProperty({ description: '是否删除' })
    isDelete: number
}
