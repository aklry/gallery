import { ApiProperty } from '@nestjs/swagger'

export class Picture {
    /**
     * 图片id
     */
    @ApiProperty({ description: '图片id', required: true })
    id: string
    /**
     * 图片url
     */
    @ApiProperty({ description: '图片url', required: true })
    url: string
    /**
     * 图片名称
     */
    @ApiProperty({ description: '图片名称', required: true })
    name: string
    /**
     * 图片介绍
     */
    @ApiProperty({ description: '图片介绍', required: true })
    introduction: string
    /**
     * 图片分类
     */
    @ApiProperty({ description: '图片分类', required: true })
    category: string
    /**
     * 图片标签
     */
    @ApiProperty({ description: '图片标签', required: true })
    tags: string
    /**
     * 图片大小
     */
    @ApiProperty({ description: '图片大小', required: true })
    picSize: bigint
    /**
     * 图片宽度
     */
    @ApiProperty({ description: '图片宽度', required: true })
    picWidth: number
    /**
     * 图片高度
     */
    @ApiProperty({ description: '图片高度', required: true })
    picHeight: number
    /**
     * 图片缩放比例
     */
    @ApiProperty({ description: '图片缩放比例', required: true })
    picScale: number
    /**
     * 图片颜色
     */
    @ApiProperty({ description: '图片颜色', required: true })
    picColor: string
    /**
     * 图片格式
     */
    @ApiProperty({ description: '图片格式', required: true })
    picFormat: string
    /**
     * 用户id
     */
    @ApiProperty({ description: '用户id', required: true })
    userId: string
    /**
     * 空间id
     */
    @ApiProperty({ description: '空间id', required: true })
    spaceId: string
    /**
     * 创建时间
     */
    @ApiProperty({ description: '创建时间', required: true })
    createTime: Date
    /**
     * 编辑时间
     */
    @ApiProperty({ description: '编辑时间', required: true })
    editTime: Date
    /**
     * 更新时间
     */
    @ApiProperty({ description: '更新时间', required: true })
    updateTime: Date
    /**
     * 审核状态
     */
    @ApiProperty({ description: '审核状态', required: true })
    reviewStatus: number
    /**
     * 审核消息
     */
    @ApiProperty({ description: '审核消息', required: true })
    reviewMessage: string
    /**
     * 审核人id
     */
    @ApiProperty({ description: '审核人id', required: true })
    reviewerId: string
    /**
     * 审核时间
     */
    @ApiProperty({ description: '审核时间', required: true })
    reviewTime: Date
    /**
     * 是否删除
     */
    @ApiProperty({ description: '是否删除', required: true })
    isDelete: number
}
