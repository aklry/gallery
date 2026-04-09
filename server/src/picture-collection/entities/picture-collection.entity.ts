import { ApiProperty } from '@nestjs/swagger'
import { UserActionStatus } from '@prisma/client'
export class PictureCollection {
    /**
     * 主键id
     */
    @ApiProperty({ description: '主键id', required: true })
    id: string
    /**
     * 收藏的图片id
     */
    @ApiProperty({ description: '收藏的图片id', required: true })
    pictureId: string
    /**
     * 收藏的用户id
     */
    @ApiProperty({ description: '收藏的用户id', required: true })
    userId: string
    /**
     * 收藏状态
     */
    @ApiProperty({ description: '收藏状态', required: true })
    status: UserActionStatus
    /**
     * 创建时间
     */
    @ApiProperty({ description: '创建时间', required: true })
    createTime: Date
    /**
     * 更新时间
     */
    @ApiProperty({ description: '更新时间', required: true })
    updateTime: Date
}
