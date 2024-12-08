import { Controller, Get } from '@nestjs/common'
import { ResponseService } from './response/response.service'
import { version } from './config'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaService } from './prisma/prisma.service'
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
    async getUser() {
        const user = await this.prismaService.user.findMany({
            where: {
                isDelete: 0
            }
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
