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
