import { version } from './config'
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
@Controller({
    version
})
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello() {
        return this.appService.getHello()
    }
}
