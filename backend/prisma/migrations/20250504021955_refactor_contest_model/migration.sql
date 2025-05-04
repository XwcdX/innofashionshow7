-- CreateTable
CREATE TABLE `Division` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Division_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `divisionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('INTERNAL', 'EXTERNAL') NOT NULL DEFAULT 'EXTERNAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `category` ENUM('INTERMEDIATE', 'ADVANCED') NULL DEFAULT 'INTERMEDIATE',
    `age` INTEGER NULL,
    `whatsapp` VARCHAR(191) NULL,
    `proofOfPayment` VARCHAR(191) NULL,
    `valid` BOOLEAN NULL,
    `nrp` VARCHAR(191) NULL,
    `batch` INTEGER NULL,
    `major` VARCHAR(191) NULL,
    `ktmPath` VARCHAR(191) NULL,
    `instance` VARCHAR(191) NULL,
    `idCardPath` VARCHAR(191) NULL,
    `adminId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Contest_userId_key`(`userId`),
    INDEX `Contest_userId_idx`(`userId`),
    INDEX `Contest_adminId_idx`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Talkshow` (
    `id` VARCHAR(191) NOT NULL,
    `asal` ENUM('Petra', 'Umum') NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `wa` VARCHAR(191) NOT NULL,
    `idline` VARCHAR(191) NOT NULL,
    `domisili` VARCHAR(191) NULL,
    `nrp` VARCHAR(191) NULL,
    `jurusan` VARCHAR(191) NULL,
    `status_pembayaran` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workshop` (
    `id` VARCHAR(191) NOT NULL,
    `asal` ENUM('Petra', 'Umum') NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `wa` VARCHAR(191) NOT NULL,
    `idline` VARCHAR(191) NOT NULL,
    `domisili` VARCHAR(191) NULL,
    `nrp` VARCHAR(191) NULL,
    `jurusan` VARCHAR(191) NULL,
    `status_pembayaran` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contest` ADD CONSTRAINT `Contest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contest` ADD CONSTRAINT `Contest_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
