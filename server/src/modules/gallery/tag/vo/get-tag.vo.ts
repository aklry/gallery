import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '@shared/common/response.vo'

export class GetTagVoModel {
    @ApiProperty({ description: '标签ID', required: true })
    id: string
    @ApiProperty({ description: '标签名称', required: true })
    tagName: string
    @ApiProperty({ description: '是否为系统标签', required: true })
    isSystem: boolean
}

export class GetTagVo extends ResponseVo<GetTagVoModel[]> {
    @ApiProperty({ description: '标签列表', required: true, type: [GetTagVoModel] })
    data: GetTagVoModel[]
}
