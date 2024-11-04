/*
  Warnings:

  - You are about to drop the column `postId` on the `event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_postId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `postId`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `eventId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `post_eventId_key` ON `post`(`eventId`);

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
