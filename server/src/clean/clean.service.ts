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
            const deleteResults = await Promise.allSettled(
                deletedPictures.map(async picture => {
                    try {
                        const ossPath = this.ossService.getOssPathFromUrl(picture.url)
                        await ossClient.delete(ossPath)
                        return { success: true, path: ossPath }
                    } catch (err) {
                        return { success: false, path: picture.url, error: err }
                    }
                })
            )

            // 统计处理结果
            const successCount = deleteResults.filter(
                result => result.status === 'fulfilled' && result.value.success
            ).length
            const failedResults = deleteResults.filter(
                result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
            )

            // 记录失败的详情
            if (failedResults.length > 0) {
                this.logger.warn(
                    `清理失败的图片数量: ${failedResults.length}`,
                    failedResults.map(result => (result.status === 'fulfilled' ? result.value : result.reason))
                )
            }

            this.logger.log(`清理完成。成功: ${successCount}，失败: ${failedResults.length}`)
        } catch (error) {
            this.logger.error('清理无用的oss图片过程中发生错误', error)
            throw error // 向上层抛出错误，便于事务回滚或其他处理
        }
    }
}
