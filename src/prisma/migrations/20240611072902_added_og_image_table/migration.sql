/*
  Warnings:

  - You are about to drop the column `OGImage` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "OGImage",
ADD COLUMN     "OGImageId" TEXT;

-- CreateTable
CREATE TABLE "OGImage" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OGImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_OGImageId_fkey" FOREIGN KEY ("OGImageId") REFERENCES "OGImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
