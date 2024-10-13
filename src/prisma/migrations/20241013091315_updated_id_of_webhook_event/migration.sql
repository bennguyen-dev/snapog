/*
  Warnings:

  - The primary key for the `WebhookEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WebhookEvent" DROP CONSTRAINT "WebhookEvent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WebhookEvent_id_seq";
