/*
  Warnings:

  - You are about to drop the column `asal` on the `workshop` table. All the data in the column will be lost.
  - You are about to drop the column `domisili` on the `workshop` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `workshop` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `workshop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Workshop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workshop` DROP COLUMN `asal`,
    DROP COLUMN `domisili`,
    DROP COLUMN `email`,
    DROP COLUMN `nama`,
    ADD COLUMN `submitted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `wa` VARCHAR(191) NULL,
    MODIFY `idline` VARCHAR(191) NULL,
    MODIFY `proofOfPayment` VARCHAR(191) NULL,
    MODIFY `valid` BOOLEAN NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Workshop_userId_key` ON `Workshop`(`userId`);

-- AddForeignKey
ALTER TABLE `Workshop` ADD CONSTRAINT `Workshop_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
