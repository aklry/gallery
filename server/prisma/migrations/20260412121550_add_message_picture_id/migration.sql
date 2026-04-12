/*
  Warnings:

  - Added the required column `pictureId` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `pictureId` VARCHAR(256) NOT NULL;
