/*
  Warnings:

  - You are about to drop the column `category` on the `ShoppingItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "icon" BYTEA,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
