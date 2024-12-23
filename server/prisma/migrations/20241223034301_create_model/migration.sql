-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `userAccount` VARCHAR(256) NOT NULL,
    `userPassword` VARCHAR(512) NOT NULL,
    `userName` VARCHAR(256) NULL,
    `userAvatar` VARCHAR(1024) NULL,
    `userProfile` VARCHAR(512) NULL,
    `userRole` VARCHAR(256) NOT NULL DEFAULT 'user',
    `editTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `uk_userAccount`(`userAccount`),
    INDEX `idx_userName`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `reviewStatus` TINYINT NOT NULL DEFAULT 0,
    `reviewMessage` VARCHAR(512) NOT NULL DEFAULT '',
    `reviewerId` VARCHAR(256) NOT NULL DEFAULT '',
    `reviewTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,
    `thumbnailUrl` VARCHAR(512) NULL,

    INDEX `idx_name`(`name`),
    INDEX `idx_introduction`(`introduction`),
    INDEX `idx_category`(`category`),
    INDEX `idx_tags`(`tags`),
    INDEX `idx_userId`(`userId`),
    INDEX `idx_reviewStatus`(`reviewStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(512) NOT NULL,
    `userId` VARCHAR(256) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,
    `hasRead` ENUM('UNREAD', 'READ') NOT NULL DEFAULT 'UNREAD',
    `title` VARCHAR(128) NULL,

    INDEX `idx_userId`(`userId`),
    INDEX `idx_content`(`content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `space` (
    `id` VARCHAR(191) NOT NULL,
    `spaceName` VARCHAR(128) NULL,
    `spaceLevel` ENUM('FREE', 'BASIC', 'PREMIUM') NULL DEFAULT 'FREE',
    `maxSize` BIGINT NULL DEFAULT 0,
    `maxCount` BIGINT NULL DEFAULT 0,
    `totalSize` BIGINT NULL DEFAULT 0,
    `totalCount` BIGINT NULL DEFAULT 0,
    `userId` VARCHAR(256) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `editTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_userId`(`userId`),
    INDEX `idx_spaceName`(`spaceName`),
    INDEX `idx_spaceLevel`(`spaceLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
