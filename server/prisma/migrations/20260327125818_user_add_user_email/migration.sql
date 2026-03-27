/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `userEmail` VARCHAR(256) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uk_userEmail` ON `user`(`userEmail`);
