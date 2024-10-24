-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "quantity" DROP NOT NULL;
