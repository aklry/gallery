import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SeoService {
    constructor(private readonly prisma: PrismaService) {}

    async generateSitemap(baseUrl: string): Promise<string> {
        // 获取所有已审核通过且未删除的公开图片（无 spaceId 表示公开）
        const pictures = await this.prisma.picture.findMany({
            where: {
                isDelete: 0,
                reviewStatus: 1,
                spaceId: null
            },
            select: {
                id: true,
                editTime: true
            },
            orderBy: { editTime: 'desc' },
            take: 50000
        })

        const staticPages = [
            { loc: '/', priority: '1.0', changefreq: 'daily' },
            { loc: '/user/login', priority: '0.3', changefreq: 'monthly' },
            { loc: '/user/register', priority: '0.3', changefreq: 'monthly' }
        ]

        const urls = staticPages
            .map(
                page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
            )
            .concat(
                pictures.map(
                    pic => `  <url>
    <loc>${baseUrl}/api/v1/picture/${pic.id}</loc>
    <lastmod>${pic.editTime.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
                )
            )

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
    }
}
