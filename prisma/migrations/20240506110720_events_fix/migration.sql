/*
  Warnings:

  - You are about to drop the column `description` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `description`,
    DROP COLUMN `images`,
    DROP COLUMN `title`,
    ADD COLUMN `eventStatusId` INTEGER NULL,
    ADD COLUMN `postId` INTEGER NULL;

-- CreateTable
CREATE TABLE `eventStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `event_postId_key` ON `event`(`postId`);

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_eventStatusId_fkey` FOREIGN KEY (`eventStatusId`) REFERENCES `eventStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
