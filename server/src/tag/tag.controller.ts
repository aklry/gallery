import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { TagService } from './tag.service'
import { version } from '../config'
import { AiCreateTagDto } from './dto'

@Controller({
    path: 'tag',
    version
})
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post('ai-create')
    async aiCreateTag(@Body(new ValidationPipe()) aiCreateTagDto: AiCreateTagDto) {
        return this.tagService.aiCreateTag(aiCreateTagDto)
    }
}
