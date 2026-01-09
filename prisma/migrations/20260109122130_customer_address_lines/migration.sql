/*
  Warnings:

  - You are about to drop the column `addressLine` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "addressLine",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT;
