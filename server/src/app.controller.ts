import { version } from '@core/config'
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ResponseService } from '@core/response/response.service'
@Controller({
    path: '/app',
    version
})
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly responseService: ResponseService
    ) {}

    @Get()
    getHello() {
        return this.responseService.success(this.appService.getHello())
    }
}
