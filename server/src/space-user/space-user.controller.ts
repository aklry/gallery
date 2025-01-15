import { Body, Controller, Post, Req } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'
import { AddSpaceUserDto, DeleteSpaceUserDto, EditSpaceUserDto, QuerySpaceUserDto } from './dto'
import { ResponseService } from '../response/response.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AddSpaceUserVo, DeleteSpaceUserVo, EditSpaceUserVo, SpaceUserEntitiesVo, SpaceUserListVo } from './vo'
import { version } from '../config'
import { type Request } from 'express'

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
    async addSpaceUser(@Body() addSpaceUserDto: AddSpaceUserDto) {
        const result = await this.spaceUserService.addSpaceUser(addSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/delete')
    @ApiOperation({ summary: '删除空间成员' })
    @ApiResponse({ type: DeleteSpaceUserVo })
    async deleteSpaceUser(@Body() deleteSpaceUserDto: DeleteSpaceUserDto) {
        const result = await this.spaceUserService.deleteSpaceUser(deleteSpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/get')
    @ApiOperation({ summary: '获取空间成员' })
    @ApiResponse({ type: SpaceUserEntitiesVo })
    async getOneSpaceUser(@Body() querySpaceUserDto: QuerySpaceUserDto) {
        const result = await this.spaceUserService.getOneSpaceUser(querySpaceUserDto)
        return this.responseService.success(result)
    }

    @Post('/list')
    @ApiOperation({ summary: '获取空间成员列表' })
    @ApiResponse({ type: SpaceUserListVo })
    async getSpaceUserList(@Body() querySpaceUserDto: QuerySpaceUserDto, @Req() req: Request) {
        const result = await this.spaceUserService.getSpaceUserList(querySpaceUserDto, req)
        return this.responseService.success(result)
    }

    @Post('/edit')
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
