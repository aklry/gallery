import { ApiProperty } from '@nestjs/swagger'
import { AiExpandPictureCreateTaskDto } from '../../ai-expand-picture/dto'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class AiExpandPictureDto {
    @ApiProperty({
        description: '图片ID'
    })
    @IsNotEmpty()
    @IsString()
    pictureId: string

    @ApiProperty({
        description: '扩图任务创建参数',
        type: AiExpandPictureCreateTaskDto
    })
    @ValidateNested()
    @Type(() => AiExpandPictureCreateTaskDto)
    aiExpandPictureCreateDto: AiExpandPictureCreateTaskDto
}
