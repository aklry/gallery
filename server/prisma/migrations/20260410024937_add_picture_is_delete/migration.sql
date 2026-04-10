-- AlterTable
ALTER TABLE `picture_download` ADD COLUMN `isDelete` TINYINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `picture_favorite` ADD COLUMN `isDelete` TINYINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `picture_like` ADD COLUMN `isDelete` TINYINT NOT NULL DEFAULT 0;
