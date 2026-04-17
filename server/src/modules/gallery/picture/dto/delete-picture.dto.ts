import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePictureDto {
    @IsString()
    @ApiProperty({ description: '图片id', required: true })
    id: string
}

export class DeleteBatchPictureDto {
    @IsString({ each: true })
    @ApiProperty({ description: '图片id列表', required: true, type: [String] })
    ids: string[]
}
