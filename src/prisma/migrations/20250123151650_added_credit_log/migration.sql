-- CreateTable
CREATE TABLE "CreditLog" (
    "id" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditLog_balanceId_idx" ON "CreditLog"("balanceId");

-- CreateIndex
CREATE INDEX "CreditLog_type_idx" ON "CreditLog"("type");

-- CreateIndex
CREATE INDEX "CreditLog_createdAt_idx" ON "CreditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "CreditLog" ADD CONSTRAINT "CreditLog_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "UserBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
