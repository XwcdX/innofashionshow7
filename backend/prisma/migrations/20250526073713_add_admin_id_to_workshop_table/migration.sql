-- AlterTable
ALTER TABLE `workshop` ADD COLUMN `adminId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Workshop` ADD CONSTRAINT `Workshop_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
