import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'
import { SpaceInviteStatus } from '../enum'

export class SpaceInviteCodeModelVo {
    @ApiProperty({ description: '邀请码记录 id' })
    id: string

    @ApiProperty({ description: '空间 id' })
    spaceId: string

    @ApiProperty({ description: '6 位邀请码' })
    code: string

    @ApiProperty({ description: '状态', enum: SpaceInviteStatus })
    status: SpaceInviteStatus

    @ApiProperty({ description: '创建人 id' })
    creatorUserId: string

    @ApiProperty({ description: '过期时间' })
    expireTime: Date

    @ApiProperty({ description: '剩余秒数' })
    remainingSeconds: number

    @ApiProperty({ description: '创建时间' })
    createTime: Date

    @ApiProperty({ description: '更新时间' })
    updateTime: Date
}

export class SpaceInviteCodeVo extends ResponseVo<SpaceInviteCodeModelVo | null> {
    @ApiProperty({
        description: '当前有效邀请码信息，可能为空',
        type: SpaceInviteCodeModelVo,
        nullable: true,
        required: false
    })
    data: SpaceInviteCodeModelVo | null
}

export class JoinSpaceInviteModelVo {
    @ApiProperty({ description: '加入成功后的空间 id' })
    spaceId: string
}

export class JoinSpaceInviteVo extends ResponseVo<JoinSpaceInviteModelVo> {
    @ApiProperty({ description: '加入空间结果', type: JoinSpaceInviteModelVo })
    data: JoinSpaceInviteModelVo
}

export class DisableSpaceInviteVo extends ResponseVo<boolean> {
    @ApiProperty({ description: '是否已失效当前邀请码' })
    data: boolean
}
