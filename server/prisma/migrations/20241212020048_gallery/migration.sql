-- CreateTable
CREATE TABLE `picture` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `introduction` VARCHAR(256) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `tags` VARCHAR(512) NOT NULL,
    `picSize` BIGINT NOT NULL,
    `picWidth` INTEGER NOT NULL,
    `picHeight` INTEGER NOT NULL,
    `picScale` DOUBLE NOT NULL,
    `picFormat` VARCHAR(32) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `editTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_name`(`name`),
    INDEX `idx_introduction`(`introduction`),
    INDEX `idx_category`(`category`),
    INDEX `idx_tags`(`tags`),
    INDEX `idx_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
