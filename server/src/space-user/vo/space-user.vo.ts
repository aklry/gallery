import { SpaceRole } from '@prisma/client'
import { SpaceModelVo } from '../../space/vo'
import { LoginVoModel } from '../../user/vo'
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
    @ApiProperty({ description: '用户信息', type: LoginVoModel })
    user: LoginVoModel
    @ApiProperty({ description: '空间信息', type: SpaceModelVo })
    space: SpaceModelVo
}
export class SpaceUserVo extends ResponseVo<SpaceUserModelVo> {
    @ApiProperty({ description: '空间用户信息', type: SpaceUserModelVo })
    data: SpaceUserModelVo
}
