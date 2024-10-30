/*
  Warnings:

  - Made the column `customProductName` on table `ShoppingItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" ALTER COLUMN "customProductName" SET NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL;
