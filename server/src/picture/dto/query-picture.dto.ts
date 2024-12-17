import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { PageRequest } from '../../common/page.dto'

export class QueryPictureDto extends PageRequest {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片id', required: false })
    id?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片名称', required: false })
    name?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片介绍', required: false })
    introduction?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片分类', required: false })
    category?: string
    @IsArray()
    @IsOptional()
    @ApiProperty({ description: '图片标签', required: false })
    tags?: string[]
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: '文件体积', required: false })
    picSize?: number
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: '图片宽度', required: false })
    picWidth?: number
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: '图片高度', required: false })
    picHeight?: number
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: '图片比例', required: false })
    picScale?: number
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '图片格式', required: false })
    picFormat?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '搜索词', required: false })
    searchText?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '用户id', required: false })
    userId?: string
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: '审核状态', required: false })
    reviewStatus?: number
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '审核人id', required: false })
    reviewerId?: string
    @IsString()
    @IsOptional()
    @ApiProperty({ description: '审核消息', required: false })
    reviewMessage?: string
}
