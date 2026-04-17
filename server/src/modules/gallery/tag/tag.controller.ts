import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import { TagService } from './tag.service'
import { version } from '@core/config'
import { AiCreateTagDto } from './dto'
import { AuthGuard } from '@identity/auth/auth.guard'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AiCreateTagVo } from './vo'
import { ResponseService } from '@core/response/response.service'
import { Request } from 'express'

@Controller({
    path: 'tag',
    version
})
export class TagController {
    constructor(
        private readonly tagService: TagService,
        private readonly response: ResponseService
    ) {}

    @Post('ai-create')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'AI生成标签' })
    @ApiResponse({ type: AiCreateTagVo })
    async aiCreateTag(@Body(new ValidationPipe()) aiCreateTagDto: AiCreateTagDto, @Req() req: Request) {
        const user = req.session.user
        const res = await this.tagService.aiCreateTag(aiCreateTagDto, user)
        return this.response.success(res)
    }
}
