-- AlterTable
ALTER TABLE `message` ADD COLUMN `actionUrl` VARCHAR(512) NULL,
    ADD COLUMN `bizId` VARCHAR(256) NULL,
    ADD COLUMN `extra` VARCHAR(1024) NULL,
    ADD COLUMN `messageType` VARCHAR(64) NOT NULL DEFAULT 'PICTURE_REVIEW',
    ADD COLUMN `result` INTEGER NULL,
    ADD COLUMN `spaceId` VARCHAR(256) NULL,
    MODIFY `pictureId` VARCHAR(256) NULL;

-- CreateTable
CREATE TABLE `space_invite_code` (
    `id` VARCHAR(191) NOT NULL,
    `spaceId` VARCHAR(256) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `creatorUserId` VARCHAR(256) NOT NULL,
    `expireTime` DATETIME(0) NOT NULL,
    `usedByUserId` VARCHAR(256) NULL,
    `usedTime` DATETIME(0) NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_code_status_expireTime`(`code`, `status`, `expireTime`),
    INDEX `idx_spaceId_status`(`spaceId`, `status`),
    INDEX `idx_creatorUserId_createTime`(`creatorUserId`, `createTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_messageType` ON `message`(`messageType`);

-- CreateIndex
CREATE INDEX `idx_spaceId` ON `message`(`spaceId`);

-- CreateIndex
CREATE INDEX `idx_bizId` ON `message`(`bizId`);
