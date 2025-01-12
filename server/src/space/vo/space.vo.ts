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
    @ApiProperty({ description: '最大容量', required: true, type: BigInt })
    maxSize: bigint
    @ApiProperty({ description: '最大数量', required: true, type: BigInt })
    maxCount: bigint
    @ApiProperty({ description: '总容量', required: true, type: BigInt })
    totalSize: bigint
    @ApiProperty({ description: '总数量', required: true, type: BigInt })
    totalCount: bigint
    @ApiProperty({ description: '空间类型', required: true, type: Number })
    spaceType: number
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

export class SpaceVoType {
    @ApiProperty({ description: '空间列表', required: true, type: [SpaceModelVo] })
    list: SpaceModelVo[]
    @ApiProperty({ description: '总数', required: true })
    total: number
}

export class SpaceVo extends ResponseVo<SpaceVoType> {
    @ApiProperty({ description: '空间列表', required: true, type: SpaceVoType })
    data: SpaceVoType
}
