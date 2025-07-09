/*
  Warnings:

  - You are about to drop the `lista` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `lista`;

-- CreateTable
CREATE TABLE `listaCompras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lista` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listaProdutos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lista` VARCHAR(191) NOT NULL,
    `produto` VARCHAR(191) NOT NULL,
    `Quantidade` INTEGER NOT NULL,
    `preco` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
