import { ApiProperty } from '@nestjs/swagger'
import { PageRequest } from '@shared/common/page.dto'

export class RecommendPictureDto extends PageRequest {
    @ApiProperty({ description: '推荐场景', required: false, default: 'home' })
    scene?: string
}
