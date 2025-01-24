/*
  Warnings:

  - You are about to drop the `CreditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditLog" DROP CONSTRAINT "CreditLog_balanceId_fkey";

-- DropTable
DROP TABLE "CreditLog";

-- CreateTable
CREATE TABLE "UserLog" (
    "id" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLog_balanceId_idx" ON "UserLog"("balanceId");

-- CreateIndex
CREATE INDEX "UserLog_type_idx" ON "UserLog"("type");

-- CreateIndex
CREATE INDEX "UserLog_status_idx" ON "UserLog"("status");

-- CreateIndex
CREATE INDEX "UserLog_createdAt_idx" ON "UserLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "UserBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
