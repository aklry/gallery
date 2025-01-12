import { SpaceRole } from '@prisma/client'

import { ApiProperty } from '@nestjs/swagger'
export class SpaceUser {
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
