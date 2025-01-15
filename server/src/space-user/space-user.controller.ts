import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { AddSpaceUserDto, DeleteSpaceUserDto, EditSpaceUserDto, QuerySpaceUserDto } from './dto'
import { ResponseService } from '../response/response.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AddSpaceUserVo, DeleteSpaceUserVo, EditSpaceUserVo, SpaceUserEntitiesVo, SpaceUserListVo } from './vo'
import { version } from '../config'
import { type Request } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionGuard } from '../permission/permission.guard'
import { SpaceUserPermissionConstant } from '../permission/SpaceUserPermissionConstant'
import { Permission } from '../permission/permission.decorator'

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
    async addSpaceUser(@Body() addSpaceUserDto: AddSpaceUserDto) {
        const result = await this.spaceUserService.addSpaceUser(addSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/delete')
    @ApiOperation({ summary: '删除空间成员' })
    @ApiResponse({ type: DeleteSpaceUserVo })
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    async deleteSpaceUser(@Body() deleteSpaceUserDto: DeleteSpaceUserDto) {
        const result = await this.spaceUserService.deleteSpaceUser(deleteSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/get')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '获取空间成员' })
    @ApiResponse({ type: SpaceUserEntitiesVo })
    async getOneSpaceUser(@Body() querySpaceUserDto: QuerySpaceUserDto) {
        const result = await this.spaceUserService.getOneSpaceUser(querySpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/list')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '获取空间成员列表' })
    @ApiResponse({ type: SpaceUserListVo })
    async getSpaceUserList(@Body() querySpaceUserDto: QuerySpaceUserDto, @Req() req: Request) {
        const result = await this.spaceUserService.getSpaceUserList(querySpaceUserDto, req)
        return this.responseService.success(result)
    }

    @Post('/edit')
    @Permission(SpaceUserPermissionConstant.SPACE_USER_MANAGE)
    @UseGuards(AuthGuard, PermissionGuard)
    @ApiOperation({ summary: '修改空间成员权限' })
    @ApiResponse({ type: EditSpaceUserVo })
    async editSpaceUserAuth(@Body() editSpaceUserDto: EditSpaceUserDto, @Req() req: Request) {
        const result = await this.spaceUserService.editSpaceUser(editSpaceUserDto, req)
        return this.responseService.success(result)
    }

    @Post('/list/my')
    @ApiOperation({ summary: '获取我加入的空间' })
    @ApiResponse({ type: SpaceUserListVo })
    async getMyAddTeam(@Req() req: Request) {
        const result = await this.spaceUserService.getMyAddTeam(req)
        return this.responseService.success(result)
    }
}
