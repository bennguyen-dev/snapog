-- CreateTable
CREATE TABLE "Demo" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "cacheDurationDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoPage" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "OGImage" TEXT,
    "OGTitle" TEXT,
    "OGDescription" TEXT,
    "SnapOGImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Demo_domain_key" ON "Demo"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "DemoPage_demoId_url_key" ON "DemoPage"("demoId", "url");

-- AddForeignKey
ALTER TABLE "DemoPage" ADD CONSTRAINT "DemoPage_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
