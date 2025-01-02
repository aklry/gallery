import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { version } from '../config'
import { AnalyzeService } from './analyze.service'
import { ResponseService } from '../response/response.service'
import {
    SpaceCategoryAnalyzeDto,
    SpaceRankAnalyzeDto,
    SpaceSizeAnalyzeDto,
    SpaceUsageAnalyzeDto,
    SpaceUserAnalyzeDto
} from './dto'
import { ValidationPipe } from '../pipe/validation.pipe'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import {
    SpaceCategoryAnalyzeVo,
    SpaceRankAnalyzeVo,
    SpaceSizeAnalyzeVo,
    SpaceTagAnalyzeVo,
    SpaceUsageAnalyzeVo,
    SpaceUserAnalyzeVo
} from './vo'
import { AuthGuard, RoleGuard } from '../auth/auth.guard'
import { Roles } from '../role/role.decorator'
import { UserRole } from '../user/enum/user'

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

    @Post('/size')
    @ApiOperation({ summary: '获取空间大小分析' })
    @ApiResponse({ type: SpaceSizeAnalyzeVo })
    @UseGuards(AuthGuard)
    async getSpaceSizeAnalyze(
        @Body(new ValidationPipe()) spaceSizeAnalyzeDto: SpaceSizeAnalyzeDto,
        @Req() req: Request
    ) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceSizeAnalyze(spaceSizeAnalyzeDto, user)
        return this.responseService.success(result)
    }

    @Post('/user')
    @ApiOperation({ summary: '获取用户空间使用分析' })
    @ApiResponse({ type: SpaceUserAnalyzeVo })
    @UseGuards(AuthGuard)
    async getUserAnalyze(@Body() spaceUserAnalyzeDto: SpaceUserAnalyzeDto, @Req() req: Request) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceUserAnalyze(spaceUserAnalyzeDto, user)
        return this.responseService.success(result)
    }

    @Post('/rank')
    @ApiOperation({ summary: '获取空间排行' })
    @ApiResponse({ type: SpaceRankAnalyzeVo })
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    async getSpaceRankAnalyze(@Body() spaceRankAnalyzeDto: SpaceRankAnalyzeDto, @Req() req: Request) {
        const user = req.session.user
        const result = await this.analyzeService.getSpaceRankAnalyze(spaceRankAnalyzeDto, user)
        return this.responseService.success(result)
    }
}
