/*
  Warnings:

  - You are about to drop the column `asal` on the `talkshow` table. All the data in the column will be lost.
  - You are about to drop the column `domisili` on the `talkshow` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `talkshow` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `talkshow` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfPayment` on the `talkshow` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `talkshow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Talkshow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Talkshow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Talkshow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `talkshow` DROP COLUMN `asal`,
    DROP COLUMN `domisili`,
    DROP COLUMN `email`,
    DROP COLUMN `nama`,
    DROP COLUMN `proofOfPayment`,
    DROP COLUMN `valid`,
    ADD COLUMN `submitted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('TALKSHOW_1', 'TALKSHOW_2', 'WEBINAR') NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `wa` VARCHAR(191) NULL,
    MODIFY `idline` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Talkshow_userId_key` ON `Talkshow`(`userId`);

-- AddForeignKey
ALTER TABLE `Talkshow` ADD CONSTRAINT `Talkshow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
