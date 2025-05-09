-- CreateTable
CREATE TABLE `Creation` (
    `id` VARCHAR(191) NOT NULL,
    `creationPath` VARCHAR(191) NULL,
    `conceptPath` VARCHAR(191) NULL,
    `contestId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Creation_contestId_key`(`contestId`),
    INDEX `Creation_contestId_idx`(`contestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Creation` ADD CONSTRAINT `Creation_contestId_fkey` FOREIGN KEY (`contestId`) REFERENCES `Contest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
