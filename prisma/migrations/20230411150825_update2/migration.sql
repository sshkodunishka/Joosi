/*
  Warnings:

  - Added the required column `nameClass` to the `Descriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Descriptions" ADD COLUMN     "nameClass" TEXT NOT NULL;
