/*
  Warnings:

  - You are about to alter the column `spaceLevel` on the `space` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.

*/
-- AlterTable
ALTER TABLE `space` MODIFY `spaceLevel` INTEGER NULL DEFAULT 0;
