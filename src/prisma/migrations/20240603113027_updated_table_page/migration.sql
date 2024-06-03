/*
  Warnings:

  - You are about to drop the column `description` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Page` table. All the data in the column will be lost.
  - Added the required column `smartOGKey` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "title",
DROP COLUMN "url",
ADD COLUMN     "OGDescription" TEXT,
ADD COLUMN     "OGImage" TEXT,
ADD COLUMN     "OGTitle" TEXT,
ADD COLUMN     "smartOGKey" TEXT NOT NULL;
