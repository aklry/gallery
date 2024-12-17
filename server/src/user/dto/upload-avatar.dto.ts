import { ApiProperty } from '@nestjs/swagger'

export class UploadAvatarDto {
    @ApiProperty({ description: '头像前缀-存储的文件夹名称' })
    prefix: string
}
