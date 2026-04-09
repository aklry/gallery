-- AlterTable
ALTER TABLE `picture` ADD COLUMN `collectionNumber` INTEGER NULL DEFAULT 0,
    ADD COLUMN `downloadNumber` INTEGER NULL DEFAULT 0,
    ADD COLUMN `likeNumber` INTEGER NULL DEFAULT 0,
    ADD COLUMN `viewNumber` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `picture_like` (
    `id` VARCHAR(191) NOT NULL,
    `pictureId` VARCHAR(256) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_picture_like_userId_status_createTime`(`userId`, `status`, `createTime`),
    INDEX `idx_picture_like_pictureId_status`(`pictureId`, `status`),
    UNIQUE INDEX `uk_picture_like_pictureId_userId`(`pictureId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picture_favorite` (
    `id` VARCHAR(191) NOT NULL,
    `pictureId` VARCHAR(256) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_picture_favorite_userId_status_createTime`(`userId`, `status`, `createTime`),
    INDEX `idx_picture_favorite_pictureId_status`(`pictureId`, `status`),
    UNIQUE INDEX `uk_picture_favorite_pictureId_userId`(`pictureId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picture_download` (
    `id` VARCHAR(191) NOT NULL,
    `pictureId` VARCHAR(256) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_picture_download_userId_createTime`(`userId`, `createTime`),
    INDEX `idx_picture_download_pictureId_createTime`(`pictureId`, `createTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
