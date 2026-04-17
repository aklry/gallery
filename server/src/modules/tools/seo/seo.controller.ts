import { Controller, Get, Header, Req } from '@nestjs/common'
import { SeoService } from './seo.service'
import { version } from '@core/config'
import { RawResponse } from '@shared/interceptors/setResponseData'
import type { Request } from 'express'
import { ApiExcludeController } from '@nestjs/swagger'

@ApiExcludeController()
@Controller({
    path: 'seo',
    version
})
export class SeoController {
    constructor(private readonly seoService: SeoService) {}

    @Get('/sitemap.xml')
    @Header('Content-Type', 'application/xml')
    @RawResponse()
    async getSitemap(@Req() req: Request) {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        return this.seoService.generateSitemap(baseUrl)
    }
}
