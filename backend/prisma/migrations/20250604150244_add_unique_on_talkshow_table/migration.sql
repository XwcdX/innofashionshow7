/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `Talkshow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Talkshow_userId_type_key` ON `Talkshow`(`userId`, `type`);
