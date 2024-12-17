import { Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'
import axios from 'axios'

@Injectable()
export class ExtractService {
    async fetchHtml(url: string) {
        const response = await axios.get(url)
        return response.data
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
