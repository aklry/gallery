import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { version } from '../config'
import { AnalyzeService } from './analyze.service'
import { ResponseService } from '../response/response.service'
import { SpaceCategoryAnalyzeDto, SpaceUsageAnalyzeDto } from './dto'
import { ValidationPipe } from '../pipe/validation.pipe'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { SpaceCategoryAnalyzeVo, SpaceTagAnalyzeVo, SpaceUsageAnalyzeVo } from './vo'
import { AuthGuard } from '../auth/auth.guard'

@Controller({
    path: 'analyze',
    version
})
export class AnalyzeController {
    constructor(
        private readonly analyzeService: AnalyzeService,
        private readonly responseService: ResponseService
    ) {}

    @Post('/usage')
    @ApiOperation({ summary: '获取空间使用情况' })
    @ApiResponse({ type: SpaceUsageAnalyzeVo })
    @UseGuards(AuthGuard)
    async getSpaceUsageAnalyze(
        @Body(new ValidationPipe()) spaceUsageAnalyzeDto: SpaceUsageAnalyzeDto,
        @Req() req: Request
    ) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceUsageAnalyze(spaceUsageAnalyzeDto, user)
        return this.responseService.success(result)
    }

    @Post('/category')
    @ApiOperation({ summary: '获取空间分类分析' })
    @ApiResponse({ type: SpaceCategoryAnalyzeVo })
    @UseGuards(AuthGuard)
    async getSpaceCategoryAnalyze(
        @Body(new ValidationPipe()) spaceCategoryAnalyzeDto: SpaceCategoryAnalyzeDto,
        @Req() req: Request
    ) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceCategoryAnalyze(spaceCategoryAnalyzeDto, user)
        return this.responseService.success(result)
    }

    @Post('/tag')
    @ApiOperation({ summary: '获取空间标签分析' })
    @ApiResponse({ type: SpaceTagAnalyzeVo })
    @UseGuards(AuthGuard)
    async getSpaceTagAnalyze(
        @Body(new ValidationPipe()) spaceTagAnalyzeDto: SpaceCategoryAnalyzeDto,
        @Req() req: Request
    ) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceTagAnalyze(spaceTagAnalyzeDto, user)
        return this.responseService.success(result)
    }
}
