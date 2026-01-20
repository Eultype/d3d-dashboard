-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REVENDEUR');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'REVENDEUR';

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
