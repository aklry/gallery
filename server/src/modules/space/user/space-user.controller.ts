import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { AddSpaceUserDto, DeleteSpaceUserDto, EditSpaceUserDto, QuerySpaceUserDto, QuitSpaceUserDto } from './dto'
import { ResponseService } from '@core/response/response.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import {
    AddSpaceUserVo,
    DeleteSpaceUserVo,
    EditSpaceUserVo,
    QuitSpaceUserVo,
    SpaceUserEntitiesVo,
    SpaceUserListVo
} from './vo'
import { version } from '@core/config'
import { type Request } from 'express'
import { AuthGuard } from '@identity/auth/auth.guard'
import { PermissionGuard } from '@identity/permission/permission.guard'
import { SpaceUserPermissionConstant } from '@identity/permission/SpaceUserPermissionConstant'
import { Permission } from '@identity/permission/permission.decorator'
import { ValidationPipe } from '@shared/pipe/validation.pipe'

@Controller({
    path: 'space-user',
    version
})
export class SpaceUserController {
    constructor(
        private readonly spaceUserService: SpaceUserService,
        private readonly responseService: ResponseService
    ) {}

    @Post('/add')
    @ApiOperation({ summary: '添加空间成员' })
    @ApiResponse({ type: AddSpaceUserVo })
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    async addSpaceUser(@Body(new ValidationPipe()) addSpaceUserDto: AddSpaceUserDto) {
        const result = await this.spaceUserService.addSpaceUser(addSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/delete')
    @ApiOperation({ summary: '删除空间成员' })
    @ApiResponse({ type: DeleteSpaceUserVo })
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    async deleteSpaceUser(@Body(new ValidationPipe()) deleteSpaceUserDto: DeleteSpaceUserDto) {
        const result = await this.spaceUserService.deleteSpaceUser(deleteSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/get')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '获取空间成员' })
    @ApiResponse({ type: SpaceUserEntitiesVo })
    async getOneSpaceUser(@Body(new ValidationPipe()) querySpaceUserDto: QuerySpaceUserDto) {
        const result = await this.spaceUserService.getOneSpaceUser(querySpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/list')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '获取空间成员列表' })
    @ApiResponse({ type: SpaceUserListVo })
    async getSpaceUserList(@Body(new ValidationPipe()) querySpaceUserDto: QuerySpaceUserDto) {
        const result = await this.spaceUserService.getSpaceUserList(querySpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/edit')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '修改空间成员角色' })
    @ApiResponse({ type: EditSpaceUserVo })
    async editSpaceUserAuth(@Body(new ValidationPipe()) editSpaceUserDto: EditSpaceUserDto) {
        const result = await this.spaceUserService.editSpaceUser(editSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/quit')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '退出团队空间' })
    @ApiResponse({ type: QuitSpaceUserVo })
    async quitSpace(@Body(new ValidationPipe()) quitSpaceUserDto: QuitSpaceUserDto, @Req() req: Request) {
        const result = await this.spaceUserService.quitSpace(quitSpaceUserDto, req)
        return this.responseService.success(result)
    }

    @Post('/list/my')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '获取我加入的空间' })
    @ApiResponse({ type: SpaceUserListVo })
    async getMyAddTeam(@Req() req: Request) {
        const result = await this.spaceUserService.getMyAddTeam(req)
        return this.responseService.success(result)
    }
}
