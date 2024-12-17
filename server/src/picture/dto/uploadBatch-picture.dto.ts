import { IsString, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class UploadBatchPictureDto {
    @IsString()
    @IsNotEmpty()
    keywords: string

    @IsNumber()
    @IsNotEmpty()
    @Max(30)
    @Min(1)
    count: number
}
