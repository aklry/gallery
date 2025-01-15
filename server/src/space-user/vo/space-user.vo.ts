import { SpaceRole } from '@prisma/client'
import { SpaceModelVo } from '../../space/vo'
import { UserVoModel } from '../../user/vo'
import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class SpaceUserModelVo {
    @ApiProperty({ description: '空间用户id' })
    id: string
    @ApiProperty({ description: '用户id' })
    userId: string
    @ApiProperty({ description: '空间id' })
    spaceId: string
    @ApiProperty({ description: '空间角色' })
    spaceRole: SpaceRole
    @ApiProperty({ description: '创建时间' })
    createTime: Date
    @ApiProperty({ description: '更新时间' })
    updateTime: Date
    @ApiProperty({ description: '用户信息', type: UserVoModel })
    user: UserVoModel | null
    @ApiProperty({ description: '空间信息', type: SpaceModelVo })
    space: SpaceModelVo | null
}

export class SpaceUserVo extends ResponseVo<SpaceUserModelVo> {
    @ApiProperty({ description: '空间用户信息', type: SpaceUserModelVo })
    data: SpaceUserModelVo
}

export class SpaceUserListVo extends ResponseVo<SpaceUserModelVo[]> {
    @ApiProperty({ description: '空间用户信息', type: [SpaceUserModelVo], isArray: true })
    data: SpaceUserModelVo[]
}

export class SpaceUserEntitiesModelVo {
    @ApiProperty({ description: '空间用户id' })
    id: string
    @ApiProperty({ description: '用户id' })
    userId: string
    @ApiProperty({ description: '空间id' })
    spaceId: string
    @ApiProperty({ description: '空间角色' })
    spaceRole: SpaceRole
    @ApiProperty({ description: '创建时间' })
    createTime: Date
    @ApiProperty({ description: '更新时间' })
    updateTime: Date
}

export class SpaceUserEntitiesVo extends ResponseVo<SpaceUserEntitiesModelVo> {
    @ApiProperty({ description: '空间用户信息', type: SpaceUserEntitiesModelVo })
    data: SpaceUserEntitiesModelVo
}
