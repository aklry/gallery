import { PartialType } from '@nestjs/swagger'
import { CreatePictureLikeDto } from './create-picture-like.dto'

export class UpdatePictureLikeDto extends PartialType(CreatePictureLikeDto) {}
