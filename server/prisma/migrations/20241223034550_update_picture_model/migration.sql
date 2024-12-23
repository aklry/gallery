-- AlterTable
ALTER TABLE `picture` ADD COLUMN `spaceId` VARCHAR(256) NULL;

-- CreateIndex
CREATE INDEX `idx_spaceId` ON `picture`(`spaceId`);
