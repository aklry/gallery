import { ApiProperty } from '@nestjs/swagger'
import { SpaceLevelEnum } from '../enum'

export class CreateSpaceDto {
    @ApiProperty({ description: '空间名称', required: true })
    spaceName: string
    @ApiProperty({ description: '空间等级', required: true, enum: SpaceLevelEnum })
    spaceLevel: SpaceLevelEnum
}
