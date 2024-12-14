import { ApiProperty } from '@nestjs/swagger'
import { ResponseVo } from '../../common/response.vo'

export class TagCategoryList {
    @ApiProperty({ description: '标签列表', required: true })
    tagList: string[]
    @ApiProperty({ description: '分类列表', required: true })
    categoryList: string[]
}

export class TagCategoryListVo extends ResponseVo<TagCategoryList> {
    @ApiProperty({ description: '标签分类列表', required: true, type: TagCategoryList })
    data: TagCategoryList
}
