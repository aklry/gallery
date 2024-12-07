import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ResponseService } from './response/response.service'
import { version } from './config'

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
    test(): API.ResponseData<{ id: number; name: string }> {
        return this.responseService.success([
            {
                id: 1,
                name: 'zs'
            }
        ])
    }
}
