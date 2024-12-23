import { UserVoModel } from '../../user/vo/user.vo'
import { ResponseVo } from '../../common/response.vo'
import { SpaceLevelEnum } from '../enum'
import { ApiProperty } from '@nestjs/swagger'

export class SpaceModelVo {
    @ApiProperty({ description: '空间ID', required: true })
    id: string
    @ApiProperty({ description: '空间名称', required: true })
    spaceName: string
    @ApiProperty({ description: '空间等级', required: true, enum: SpaceLevelEnum })
    spaceLevel: SpaceLevelEnum
    @ApiProperty({ description: '最大容量', required: true })
    maxSize: bigint
    @ApiProperty({ description: '最大数量', required: true })
    maxCount: bigint
    @ApiProperty({ description: '总容量', required: true })
    totalSize: bigint
    @ApiProperty({ description: '总数量', required: true })
    totalCount: bigint
    @ApiProperty({ description: '用户ID', required: true })
    userId: string
    @ApiProperty({ description: '创建时间', required: true })
    createTime: Date
    @ApiProperty({ description: '编辑时间', required: true })
    editTime: Date
    @ApiProperty({ description: '更新时间', required: true })
    updateTime: Date
    @ApiProperty({ description: '用户信息', required: true })
    user: UserVoModel
}

export class SpaceVo extends ResponseVo<SpaceModelVo> {
    data: SpaceModelVo
}
