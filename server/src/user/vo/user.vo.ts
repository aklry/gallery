import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
export class UserVoModel {
    @ApiProperty({ description: '用户id' })
    id: string
    @ApiProperty({ description: '用户昵称' })
    userName: string
    @ApiProperty({ description: '用户头像' })
    userAvatar: string
    @ApiProperty({ description: '用户简介' })
    userProfile: string
    @ApiProperty({ description: '用户角色' })
    userRole: string
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
