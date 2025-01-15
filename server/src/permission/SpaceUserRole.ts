import { ApiProperty } from '@nestjs/swagger'

export class SpaceUserRole {
    @ApiProperty({ description: '角色key' })
    key: string
    @ApiProperty({ description: '角色名称' })
    name: string
    @ApiProperty({ description: '权限键列表' })
    permissions: string[]
    @ApiProperty({ description: '角色描述' })
    description: string
}
