/*
  Warnings:

  - You are about to drop the column `eventStatusId` on the `event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_eventStatusId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `eventStatusId`,
    ADD COLUMN `statusId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `eventStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
