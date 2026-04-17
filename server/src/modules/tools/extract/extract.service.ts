import { Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'

@Injectable()
export class ExtractService {
    async fetchHtml(url: string): Promise<string> {
        const response = await fetch(url)
        return response.text()
    }

    async extractImage(html: string, count: number) {
        const $ = cheerio.load(html)
        let imagesUrl: string[] = []

        $('img').each((index, element) => {
            const src = $(element).attr('src')
            if (src) {
                imagesUrl.push(src)
            }
        })

        if (imagesUrl.length > count) {
            imagesUrl = imagesUrl.slice(0, count)
        }

        return imagesUrl
    }
}
