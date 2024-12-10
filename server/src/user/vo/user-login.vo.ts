import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
export class LoginVoModel {
    @ApiProperty({ description: '用户ID' })
    id: string
    @ApiProperty({ description: '用户账号' })
    userAccount: string
    @ApiProperty({ description: '用户名' })
    userName: string
    @ApiProperty({ description: '用户头像' })
    userAvatar: string
    @ApiProperty({ description: '用户简介' })
    userProfile: string
    @ApiProperty({ description: '用户角色' })
    userRole: string
}
export class UserLoginVo extends ResponseVo<LoginVoModel> {
    @ApiProperty({ description: '用户信息', type: LoginVoModel })
    data: LoginVoModel
}
