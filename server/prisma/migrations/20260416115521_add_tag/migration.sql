-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(191) NOT NULL,
    `tagName` VARCHAR(128) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `useCount` INTEGER NOT NULL DEFAULT 0,
    `isSystem` TINYINT NOT NULL DEFAULT 0,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `uk_tagName`(`tagName`),
    INDEX `idx_tagName`(`tagName`),
    INDEX `idx_useCount`(`useCount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picture_tag` (
    `id` VARCHAR(191) NOT NULL,
    `pictureId` VARCHAR(256) NOT NULL,
    `tagId` VARCHAR(256) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_fk_pictureId`(`pictureId`),
    INDEX `idx_fk_tagId`(`tagId`),
    UNIQUE INDEX `uk_pictureId_tagId`(`pictureId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
