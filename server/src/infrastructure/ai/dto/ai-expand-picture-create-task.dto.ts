import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class AiExpandPictureCreateTaskDto {
    @ApiProperty({ description: '图片url', required: true })
    @IsString()
    @IsNotEmpty()
    url: string
    @ApiProperty({ description: '扩图比例', required: true })
    @IsNumber()
    @Min(1)
    xScale: number
    @ApiProperty({ description: '扩图比例', required: true })
    @IsNumber()
    @Min(1)
    yScale: number
}
