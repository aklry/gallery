import { Controller, Get, Post, Body, UseGuards, Req, Sse, MessageEvent, Query } from '@nestjs/common'
import { MessageService } from './message.service'
import { ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { MessageVo } from './vo/message.vo'
import { ResponseService } from '@core/response/response.service'
import { AuthGuard } from '@identity/auth/auth.guard'
import { ReadMessageDto } from './dto/read-message.dto'
import { ReadMessageVo } from './vo/read-message.vo'
import { Request } from 'express'
import { ValidationPipe } from '@shared/pipe/validation.pipe'
import { ReadAllMessageVo } from './vo/read-all-message.vo'
import { Observable } from 'rxjs'
import { version } from '@core/config'
import { PageRequestPick } from '@shared/common/page.dto'
@Controller({
    path: 'message',
    version
})
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly responseService: ResponseService
    ) {}

    @Get('/new/message')
    @ApiOperation({ summary: '获取最新消息' })
    @ApiResponse({ type: MessageVo })
    @UseGuards(AuthGuard)
    async findAllNewMessage(@Req() req: Request, @Body(new ValidationPipe()) pageDto: PageRequestPick) {
        const pageNum = pageDto.current ? parseInt(pageDto.current, 10) : 1
        const pageSizeNum = pageDto.pageSize ? parseInt(pageDto.pageSize, 10) : 50
        const { list, total } = await this.messageService.findAllNewMessage(req, pageNum, pageSizeNum)
        return this.responseService.success({
            list,
            total
        })
    }

    @Get('/history/message')
    @ApiOperation({ summary: '获取历史消息' })
    @ApiResponse({ type: MessageVo })
    @UseGuards(AuthGuard)
    async findAllHistoryMessage(@Req() req: Request, @Body(new ValidationPipe()) pageDto: PageRequestPick) {
        const pageNum = pageDto.current ? parseInt(pageDto.current, 10) : 1
        const pageSizeNum = pageDto.pageSize ? parseInt(pageDto.pageSize, 10) : 50
        const { list, total } = await this.messageService.findAllHistoryMessage(req, pageNum, pageSizeNum)
        return this.responseService.success({
            list,
            total
        })
    }

    @Post('/read/message')
    @ApiOperation({ summary: '阅读消息' })
    @ApiResponse({ type: ReadMessageVo })
    @UseGuards(AuthGuard)
    async readMessage(@Body(new ValidationPipe()) readMessageDto: ReadMessageDto) {
        const data = await this.messageService.readMessage(readMessageDto)
        return this.responseService.success(data)
    }

    @Post('/read/all/message')
    @ApiOperation({ summary: '全部已读' })
    @ApiResponse({ type: ReadAllMessageVo })
    @UseGuards(AuthGuard)
    async readAllMessage(@Req() req: Request) {
        const data = await this.messageService.readAllMessage(req)
        return this.responseService.success(data)
    }

    @Sse('/stream')
    @UseGuards(AuthGuard)
    @ApiExcludeEndpoint()
    streamMessages(@Req() req: Request): Observable<MessageEvent> {
        return this.messageService.streamMessages(req.session.user.id)
    }
}
