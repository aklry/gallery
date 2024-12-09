import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ResponseService } from './response/response.service'
import { version } from './config'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaService } from './prisma/prisma.service'
import { AuthGuard, RoleGuard } from './auth/auth.guard'
import { Roles } from './role/role.decorator'
import { PageRequest } from './common/page.dto'
class ResponseData {
    @ApiProperty({ description: 'id' })
    id: number
    @ApiProperty({ description: 'name' })
    name: string
}
@ApiTags('app')
@Controller({
    version
})
export class AppController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly prismaService: PrismaService
    ) {}

    @Get()
    async getUser(@Query() query: PageRequest) {
        const { current, pageSize, sortOrder, sortField } = query
        let orderBy: any = {}
        if (sortField) {
            orderBy = {
                [sortField]: sortOrder || 'desc'
            }
        }
        const user = await this.prismaService.user.findMany({
            where: {
                isDelete: 0
            },
            orderBy,
            skip: (Number(current) - 1) * Number(pageSize),
            take: Number(pageSize)
        })
        return this.responseService.success(user)
    }

    @Get('/test')
    @ApiOperation({ summary: '测试' })
    @ApiResponse({
        description: '测试成功',
        type: ResponseData
    })
    test(): API.ResponseData<{ id: number; name: string }[]> {
        return this.responseService.success([
            {
                id: 1,
                name: 'zs'
            }
        ])
    }
}
