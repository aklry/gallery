import { ApiProperty } from '@nestjs/swagger'

export class User {
    /**
     * 用户ID
     */
    @ApiProperty({
        description: '用户ID',
        example: '1'
    })
    id: string
    /**
     * 用户账号
     */
    @ApiProperty({
        description: '用户账号',
        example: 'admin'
    })
    userAccount: string
    /**
     * 用户密码
     */
    @ApiProperty({
        description: '用户密码',
        example: '123456'
    })
    userPassword: string
    /**
     * 用户名
     */
    @ApiProperty({
        description: '用户名',
        example: '张三'
    })
    userName: string
    /**
     * 用户头像
     */
    @ApiProperty({
        description: '用户头像',
        example: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
    })
    userAvatar: string
    /**
     * 用户简介
     */
    @ApiProperty({
        description: '用户简介',
        example: '用户简介'
    })
    userProfile: string
    /**
     * 用户角色
     */
    @ApiProperty({
        description: '用户角色',
        example: 'admin'
    })
    userRole: string
    /**
     * 编辑时间
     */
    @ApiProperty({
        description: '编辑时间',
        example: '2024-01-01 10:00:00'
    })
    editTime: Date
    /**
     * 创建时间
     */
    @ApiProperty({
        description: '创建时间',
        example: '2024-01-01 10:00:00'
    })
    createTime: Date
    /**
     * 更新时间
     */
    @ApiProperty({
        description: '更新时间',
        example: '2024-01-01 10:00:00'
    })
    updateTime: Date
    /**
     * 是否删除
     */
    @ApiProperty({
        description: '是否删除',
        example: 0
    })
    isDelete: number
}
