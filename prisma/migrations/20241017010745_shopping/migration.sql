/*
  Warnings:

  - Added the required column `updatedAt` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "unit" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingList" ALTER COLUMN "name" SET DEFAULT 'Shopping List';
