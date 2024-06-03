/*
  Warnings:

  - You are about to drop the column `smartOGKey` on the `Page` table. All the data in the column will be lost.
  - Added the required column `OGSmartImageKey` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "smartOGKey",
ADD COLUMN     "OGSmartImageKey" TEXT NOT NULL;
