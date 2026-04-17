import { Injectable, Logger } from '@nestjs/common'
import { OssService } from '@infra/oss/oss.service'
import { PictureService } from '@gallery/picture/picture.service'
import { Cron } from '@nestjs/schedule'

type OssClient = ReturnType<OssService['getOssClient']>

type CleanTargetType = 'original' | 'thumbnail'

interface CleanTarget {
    type: CleanTargetType
    path: string
}

interface CleanResult {
    success: boolean
    type: CleanTargetType
    path: string
    reason?: 'not-found' | 'unexpected-status' | 'still-exists-after-delete' | 'delete-error'
    status?: number
    error?: unknown
}

interface PictureCleanResult {
    pictureId: string
    targetResults: CleanResult[]
    canDeleteRecord: boolean
}

@Injectable()
export class CleanService {
    private logger = new Logger(CleanService.name)

    constructor(
        private readonly ossService: OssService,
        private readonly pictureService: PictureService
    ) {}

    private getDeleteTargets(picture: { url: string; thumbnailUrl?: string | null }): CleanTarget[] {
        const urls = [
            { type: 'original' as const, url: picture.url },
            ...(picture.thumbnailUrl ? [{ type: 'thumbnail' as const, url: picture.thumbnailUrl }] : [])
        ]

        const targetMap = new Map<string, CleanTarget>()

        urls.forEach(target => {
            const path = this.ossService.getOssPathFromUrl(target.url)
            if (!targetMap.has(path)) {
                targetMap.set(path, { type: target.type, path })
            }
        })

        return Array.from(targetMap.values())
    }

    private isOssObjectNotFound(error: unknown) {
        if (typeof error !== 'object' || error === null) {
            return false
        }

        const ossError = error as { code?: string; status?: number; name?: string }
        return (
            ossError.code === 'NoSuchKey' ||
            ossError.code === 'NotFound' ||
            ossError.status === 404 ||
            ossError.name === 'NoSuchKeyError'
        )
    }

    private async objectExists(ossClient: OssClient, path: string) {
        try {
            await ossClient.head(path)
            return true
        } catch (error) {
            if (this.isOssObjectNotFound(error)) {
                return false
            }
            throw error
        }
    }

    private async deleteTarget(ossClient: OssClient, target: CleanTarget): Promise<CleanResult> {
        try {
            const existedBeforeDelete = await this.objectExists(ossClient, target.path)
            if (!existedBeforeDelete) {
                return {
                    success: false,
                    type: target.type,
                    path: target.path,
                    reason: 'not-found'
                }
            }

            const deleteResult = await ossClient.delete(target.path)
            const existsAfterDelete = await this.objectExists(ossClient, target.path)

            if (deleteResult.res.status !== 204) {
                return {
                    success: false,
                    type: target.type,
                    path: target.path,
                    reason: 'unexpected-status',
                    status: deleteResult.res.status
                }
            }

            if (existsAfterDelete) {
                return {
                    success: false,
                    type: target.type,
                    path: target.path,
                    reason: 'still-exists-after-delete',
                    status: deleteResult.res.status
                }
            }

            return {
                success: true,
                type: target.type,
                path: target.path,
                status: 204
            }
        } catch (error) {
            return {
                success: false,
                type: target.type,
                path: target.path,
                reason: 'delete-error',
                error
            }
        }
    }

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
            const pictureCleanResults: PictureCleanResult[] = await Promise.all(
                deletedPictures.map(async picture => {
                    const targetResults = await Promise.all(
                        this.getDeleteTargets(picture).map(target => this.deleteTarget(ossClient, target))
                    )

                    return {
                        pictureId: picture.id,
                        targetResults,
                        canDeleteRecord: targetResults.every(result => result.success || result.reason === 'not-found')
                    }
                })
            )

            const deleteResults = pictureCleanResults.flatMap(result => result.targetResults)
            const pictureIdsToDelete = pictureCleanResults
                .filter(result => result.canDeleteRecord)
                .map(result => result.pictureId)

            let deletedRecordCount = 0
            if (pictureIdsToDelete.length > 0) {
                deletedRecordCount = await this.pictureService.hardDeleteDeletedPicturesByIds(pictureIdsToDelete)
            }

            const successResults = deleteResults.filter(result => result.success)
            const missingResults = deleteResults.filter(result => !result.success && result.reason === 'not-found')
            const failedResults = deleteResults.filter(result => !result.success && result.reason !== 'not-found')

            if (missingResults.length > 0) {
                this.logger.warn(
                    `清理前未找到的OSS对象数量: ${missingResults.length}`,
                    missingResults.map(({ type, path }) => ({ type, path }))
                )
            }

            if (failedResults.length > 0) {
                this.logger.warn(
                    `清理失败的OSS对象数量: ${failedResults.length}`,
                    failedResults.map(({ type, path, reason, status, error }) => ({
                        type,
                        path,
                        reason,
                        status,
                        error
                    }))
                )
            }

            if (deletedRecordCount !== pictureIdsToDelete.length) {
                this.logger.warn(
                    `图片数据库记录删除数量与预期不一致，预期: ${pictureIdsToDelete.length}，实际: ${deletedRecordCount}`,
                    pictureIdsToDelete
                )
            }

            this.logger.log(
                `清理完成。成功删除OSS对象: ${successResults.length}，删除前不存在: ${missingResults.length}，失败: ${failedResults.length}，删除数据库记录: ${deletedRecordCount}`
            )
        } catch (error) {
            this.logger.error('清理无用的oss图片过程中发生错误', error)
            throw error // 向上层抛出错误，便于事务回滚或其他处理
        }
    }
}
