-- DropForeignKey
ALTER TABLE `talkshow` DROP FOREIGN KEY `Talkshow_userId_fkey`;

-- DropIndex
DROP INDEX `Talkshow_userId_key` ON `talkshow`;

-- AddForeignKey
ALTER TABLE `Talkshow` ADD CONSTRAINT `Talkshow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
