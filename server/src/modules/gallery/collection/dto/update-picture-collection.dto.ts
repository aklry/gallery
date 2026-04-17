import { ApiProperty } from '@nestjs/swagger'
import { UserActionStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class UpdatePictureCollectionDto {
    @IsEnum(UserActionStatus)
    @IsNotEmpty()
    @ApiProperty({ description: '收藏状态', required: true })
    status: UserActionStatus
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '用户id', required: true })
    userId: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: '图片id', required: true })
    pictureId: string
}
