import { PageRequest } from '../../common/page.dto'
import { ApiProperty } from '@nestjs/swagger'
import { SpaceLevelEnum } from '../enum'

export class QuerySpaceDto extends PageRequest {
    @ApiProperty({ description: '空间id', required: false })
    id?: string
    @ApiProperty({ description: '用户id', required: false })
    userId?: string
    @ApiProperty({ description: '空间名称', required: false })
    spaceName?: string
    @ApiProperty({ description: '空间等级', required: false, enum: SpaceLevelEnum })
    spaceLevel?: SpaceLevelEnum
    @ApiProperty({ description: '空间类型', required: false, type: Number })
    spaceType?: number
}
