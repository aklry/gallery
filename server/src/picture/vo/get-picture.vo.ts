import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'
import { LoginVoModel } from '../../user/vo/user-login.vo'
export class GetPictureVoModel {
    @ApiProperty({ description: '图片ID' })
    id?: string
    @ApiProperty({ description: '图片URL' })
    url?: string
    @ApiProperty({ description: '图片名称' })
    name?: string
    @ApiProperty({ description: '图片简介' })
    introduction?: string
    @ApiProperty({ description: '图片分类' })
    category?: string
    @ApiProperty({ description: '图片标签' })
    tags?: string[]
    @ApiProperty({ description: '图片尺寸' })
    picSize?: number
    @ApiProperty({ description: '图片宽度' })
    picWidth?: number
    @ApiProperty({ description: '图片高度' })
    picHeight?: number
    @ApiProperty({ description: '图片缩放比例' })
    picScale?: number
    @ApiProperty({ description: '图片格式' })
    picFormat?: string
    @ApiProperty({ description: '创建时间' })
    createTime?: string
    @ApiProperty({ description: '用户信息', type: LoginVoModel })
    user?: LoginVoModel
    @ApiProperty({ description: '编辑时间' })
    editTime?: string
}
export class GetPictureVo extends ResponseVo<GetPictureVoModel> {
    @ApiProperty({ description: '图片信息', type: GetPictureVoModel })
    data: GetPictureVoModel
}
