import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
export class UserVoModel {
    @ApiProperty({ description: '用户id', required: true })
    id: string
    @ApiProperty({ description: '用户昵称', required: true })
    userName: string
    @ApiProperty({ description: '用户头像', required: true })
    userAvatar: string
    @ApiProperty({ description: '用户简介', required: true })
    userProfile: string
    @ApiProperty({ description: '用户角色', required: true })
    userRole: string
    @ApiProperty({ description: '创建时间', required: true })
    createTime: string
    @ApiProperty({ description: '用户账户', required: true })
    userAccount: string
}

export class UserVoType {
    @ApiProperty({ description: '用户信息', type: [UserVoModel] })
    list: UserVoModel[]
    @ApiProperty({ description: '总数' })
    total: number
}

export class UserVo extends ResponseVo<UserVoType> {
    @ApiProperty({ description: '用户信息', type: UserVoType })
    data: UserVoType
}
