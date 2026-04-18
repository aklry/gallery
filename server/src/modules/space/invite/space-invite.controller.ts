import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { version } from '@core/config'
import { ResponseService } from '@core/response/response.service'
import { AuthGuard } from '@identity/auth/auth.guard'
import { PermissionGuard } from '@identity/permission/permission.guard'
import { Permission } from '@identity/permission/permission.decorator'
import { SpaceUserPermissionConstant } from '@identity/permission/SpaceUserPermissionConstant'
import { ValidationPipe } from '@shared/pipe/validation.pipe'
import { DisableSpaceInviteVo, JoinSpaceInviteVo, SpaceInviteCodeVo } from './vo'
import { GenerateSpaceInviteDto, JoinSpaceInviteDto, ManageSpaceInviteDto } from './dto'
import { SpaceInviteService } from './space-invite.service'

@Controller({
    path: 'space-invite',
    version
})
export class SpaceInviteController {
    constructor(
        private readonly spaceInviteService: SpaceInviteService,
        private readonly responseService: ResponseService
    ) {}

    @Post('/generate')
    @ApiOperation({ summary: '生成空间邀请码' })
    @ApiResponse({ type: SpaceInviteCodeVo })
    @Permission(SpaceUserPermissionConstant.SPACE_INVITE)
    @UseGuards(AuthGuard, PermissionGuard)
    async generate(@Body(new ValidationPipe()) generateSpaceInviteDto: GenerateSpaceInviteDto, @Req() req: Request) {
        const result = await this.spaceInviteService.generate(generateSpaceInviteDto, req)
        return this.responseService.success(result)
    }

    @Get('/current')
    @ApiOperation({ summary: '获取当前有效空间邀请码' })
    @ApiResponse({ type: SpaceInviteCodeVo })
    @Permission(SpaceUserPermissionConstant.SPACE_INVITE)
    @UseGuards(AuthGuard, PermissionGuard)
    async current(@Query(new ValidationPipe()) manageSpaceInviteDto: ManageSpaceInviteDto) {
        const result = await this.spaceInviteService.getCurrent(manageSpaceInviteDto)
        return this.responseService.success(result)
    }

    @Post('/disable')
    @ApiOperation({ summary: '使当前空间邀请码失效' })
    @ApiResponse({ type: DisableSpaceInviteVo })
    @Permission(SpaceUserPermissionConstant.SPACE_INVITE)
    @UseGuards(AuthGuard, PermissionGuard)
    async disable(@Body(new ValidationPipe()) manageSpaceInviteDto: ManageSpaceInviteDto) {
        const result = await this.spaceInviteService.disable(manageSpaceInviteDto)
        return this.responseService.success(result)
    }

    @Post('/join')
    @ApiOperation({ summary: '通过邀请码加入团队空间' })
    @ApiResponse({ type: JoinSpaceInviteVo })
    @UseGuards(AuthGuard)
    async join(@Body(new ValidationPipe()) joinSpaceInviteDto: JoinSpaceInviteDto, @Req() req: Request) {
        const result = await this.spaceInviteService.join(joinSpaceInviteDto, req)
        return this.responseService.success(result)
    }
}
