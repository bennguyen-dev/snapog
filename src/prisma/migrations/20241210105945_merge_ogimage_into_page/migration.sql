/*
  Warnings:

  - You are about to drop the column `OGImageId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the `OGImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_OGImageId_fkey";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "OGImageId",
ADD COLUMN     "imageExpiresAt" TIMESTAMP(3),
ADD COLUMN     "imageSrc" TEXT;

-- DropTable
DROP TABLE "OGImage";
