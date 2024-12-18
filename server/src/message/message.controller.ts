import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { MessageService } from './message.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { MessageVo } from './vo/message.vo'
import { ResponseService } from '../response/response.service'
import { AuthGuard } from '../auth/auth.guard'
import { ReadMessageDto } from './dto/read-message.dto'
import { ReadMessageVo } from './vo/read-message.vo'
import { Request } from 'express'
@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly responseService: ResponseService
    ) {}

    @Get('/new/message')
    @ApiOperation({ summary: '获取最新消息' })
    @ApiResponse({ type: MessageVo })
    @UseGuards(AuthGuard)
    async findAllNewMessage(@Req() req: Request) {
        const { list, total } = await this.messageService.findAllNewMessage(req)
        return this.responseService.success({
            list,
            total
        })
    }

    @Get('/history/message')
    @ApiOperation({ summary: '获取历史消息' })
    @ApiResponse({ type: MessageVo })
    @UseGuards(AuthGuard)
    async findAllHistoryMessage(@Req() req: Request) {
        const { list, total } = await this.messageService.findAllHistoryMessage(req)
        return this.responseService.success({
            list,
            total
        })
    }

    @Post('/read/message')
    @ApiOperation({ summary: '阅读消息' })
    @ApiResponse({ type: ReadMessageVo })
    @UseGuards(AuthGuard)
    async readMessage(@Body() readMessageDto: ReadMessageDto) {
        const data = await this.messageService.readMessage(readMessageDto)
        return this.responseService.success(data)
    }
}
