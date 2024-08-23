/*
  Warnings:

  - A unique constraint covering the columns `[siteId,url]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,domain]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page_siteId_url_key" ON "Page"("siteId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "Site_userId_domain_key" ON "Site"("userId", "domain");
