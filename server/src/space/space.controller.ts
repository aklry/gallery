import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { SpaceService } from './space.service'
import { CreateSpaceDto } from './dto/create-space.dto'
import { type Request } from 'express'
import { ResponseService } from '../response/response.service'
import { UpdateSpaceDto } from './dto/update-space.dto'
import { Roles } from '../role/role.decorator'
import { UserRole } from '../user/enum/user'
import { AuthGuard, RoleGuard } from '../auth/auth.guard'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AddSpaceVo, UpdateSpaceVo, SpaceLevelVo, EditSpaceVo, DeleteSpaceVo, SpaceVo } from './vo'
import { ValidationPipe } from '../pipe/validation.pipe'
import { version } from '../config'
import { SpaceLevelMap } from './enum'
import { DeleteSpaceDto } from './dto/delete-space.dto'
import { EditSpaceDto } from './dto/edit-space.dto'
import { QuerySpaceDto } from './dto/query-space.dto'

@Controller({
    path: 'space',
    version
})
export class SpaceController {
    constructor(
        private readonly spaceService: SpaceService,
        private readonly responseService: ResponseService
    ) {}
    @Post('/add')
    @ApiResponse({ type: AddSpaceVo })
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '创建空间' })
    async addSpace(@Body(new ValidationPipe()) createSpaceDto: CreateSpaceDto, @Req() req: Request) {
        const result = await this.spaceService.addSpace(createSpaceDto, req)
        return this.responseService.success(result)
    }
    @Post('/update')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: '更新空间' })
    @ApiResponse({ type: UpdateSpaceVo })
    async updateSpace(@Body(new ValidationPipe()) updateSpaceDto: UpdateSpaceDto) {
        const result = await this.spaceService.updateSpace(updateSpaceDto)
        return this.responseService.success(result)
    }
    @Post('/delete')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '删除空间' })
    @ApiResponse({ type: DeleteSpaceVo })
    async deleteSpace(@Body(new ValidationPipe()) deleteSpaceDto: DeleteSpaceDto, @Req() req: Request) {
        const result = await this.spaceService.deleteSpace(deleteSpaceDto, req)
        return this.responseService.success(result)
    }
    @Post('/edit')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: '编辑空间' })
    @ApiResponse({ type: EditSpaceVo })
    async editSpace(@Body(new ValidationPipe()) editSpaceDto: EditSpaceDto, @Req() req: Request) {
        const result = await this.spaceService.editSpace(editSpaceDto, req)
        return this.responseService.success(result)
    }
    @Get('/list/level')
    @ApiOperation({ summary: '获取空间等级列表' })
    @ApiResponse({ type: SpaceLevelVo })
    async listSpaceLevel() {
        const result = Object.values(SpaceLevelMap).map(item => {
            return {
                value: item.value,
                text: item.text,
                maxCount: item.maxCount,
                maxSize: item.maxSize
            }
        })
        return this.responseService.success(result)
    }
    @Post('/list')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: '获取空间列表' })
    @ApiResponse({ type: SpaceVo })
    async listSpace(@Body(new ValidationPipe()) querySpaceDto: QuerySpaceDto) {
        const result = await this.spaceService.getSpaceByPage(querySpaceDto)
        return this.responseService.success(result)
    }
}
