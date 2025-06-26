/*
  Warnings:

  - Added the required column `aiSummary` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `aiSummary` TEXT NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `interviewers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `aiSummary` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
