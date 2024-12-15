/*
  Warnings:

  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserUsage" DROP CONSTRAINT "UserUsage_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserUsage" DROP CONSTRAINT "UserUsage_userId_fkey";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "UserUsage";

-- DropTable
DROP TABLE "WebhookEvent";
