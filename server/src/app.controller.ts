import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ResponseService } from './response/response.service'
import { version } from './config'
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
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
        private readonly appService: AppService,
        private readonly responseService: ResponseService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('/test')
    @ApiOperation({ summary: '测试' })
    @ApiResponse({
        description: '测试成功',
        type: ResponseData
    })
    test(): API.ResponseData<{ id: number; name: string }> {
        return this.responseService.success([
            {
                id: 1,
                name: 'zs'
            }
        ])
    }
}
