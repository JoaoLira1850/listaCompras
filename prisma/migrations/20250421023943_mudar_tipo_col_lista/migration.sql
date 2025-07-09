/*
  Warnings:

  - You are about to alter the column `lista` on the `listaprodutos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `listaprodutos` MODIFY `lista` INTEGER NOT NULL;
