-- AlterTable
ALTER TABLE "WebhookEvent" ADD COLUMN     "checkoutId" TEXT,
ADD COLUMN     "checkoutStatus" TEXT;

-- CreateIndex
CREATE INDEX "WebhookEvent_checkoutId_idx" ON "WebhookEvent"("checkoutId");
