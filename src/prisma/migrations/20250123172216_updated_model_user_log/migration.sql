/*
  Warnings:

  - You are about to drop the column `balanceId` on the `UserLog` table. All the data in the column will be lost.
  - The `status` column on the `UserLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `UserLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `UserLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LOG_STATUS" AS ENUM ('SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "LOG_TYPE" AS ENUM ('FREE_CREDITS', 'PURCHASE_CREDITS', 'PAGE_CREATION', 'PAGE_MANUAL_REFRESH');

-- DropForeignKey
ALTER TABLE "DemoPage" DROP CONSTRAINT "DemoPage_demoId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLog" DROP CONSTRAINT "UserLog_balanceId_fkey";

-- DropIndex
DROP INDEX "UserLog_balanceId_idx";

-- AlterTable
ALTER TABLE "UserLog" DROP COLUMN "balanceId",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "LOG_TYPE" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "LOG_STATUS" NOT NULL DEFAULT 'SUCCESS';

-- CreateIndex
CREATE INDEX "UserLog_userId_idx" ON "UserLog"("userId");

-- CreateIndex
CREATE INDEX "UserLog_type_idx" ON "UserLog"("type");

-- CreateIndex
CREATE INDEX "UserLog_status_idx" ON "UserLog"("status");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoPage" ADD CONSTRAINT "DemoPage_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
