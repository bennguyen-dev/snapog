/*
  Warnings:

  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseHistory" DROP CONSTRAINT "PurchaseHistory_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseHistory" DROP CONSTRAINT "PurchaseHistory_userId_fkey";

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "PurchaseHistory";
