-- CreateTable
CREATE TABLE `space_user` (
    `id` VARCHAR(191) NOT NULL,
    `spaceId` VARCHAR(256) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `spaceRole` ENUM('viewer', 'editor', 'admin') NOT NULL DEFAULT 'viewer',
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_spaceId`(`spaceId`),
    INDEX `idx_userId`(`userId`),
    UNIQUE INDEX `uk_spaceId_userId`(`spaceId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
