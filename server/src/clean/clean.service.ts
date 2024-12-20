import { Injectable, Logger } from '@nestjs/common'
import { OssService } from '../oss/oss.service'
import { PictureService } from '../picture/picture.service'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class CleanService {
    private logger = new Logger(CleanService.name)
    constructor(
        private readonly ossService: OssService,
        private readonly pictureService: PictureService
    ) {}
    // 每天0点执行
    @Cron('0 0 0 * * *')
    async clean() {
        this.logger.log('开始清理无用的oss图片')
        try {
            const deletedPictures = await this.pictureService.findDeletedPicture()
            if (deletedPictures.length === 0) {
                this.logger.log('没有需要清理的图片')
                return
            }
            const ossClient = this.ossService.getOssClient()
            for (const picture of deletedPictures) {
                const ossPath = this.ossService.getOssPathFromUrl(picture.url)
                await ossClient.delete(ossPath)
                this.logger.log(`清理图片: ${ossPath} 成功`)
            }
            this.logger.log('清理无用的oss图片成功')
        } catch (error) {
            this.logger.error('清理无用的oss图片失败', error)
        }
    }
}
