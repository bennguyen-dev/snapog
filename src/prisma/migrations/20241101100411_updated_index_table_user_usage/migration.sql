/*
  Warnings:

  - A unique constraint covering the columns `[userId,subscriptionId]` on the table `UserUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserUsage_userId_periodStart_periodEnd_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_subscriptionId_key" ON "UserUsage"("userId", "subscriptionId");
