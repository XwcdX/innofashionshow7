/*
  Warnings:

  - You are about to alter the column `status_pembayaran` on the `talkshow` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `talkshow` MODIFY `status_pembayaran` BOOLEAN NOT NULL DEFAULT false;
