-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCostCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shippingType" TEXT;
