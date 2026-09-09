-- CreateTable
CREATE TABLE "ChatChunk" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "content" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatChunk_sourceId_idx" ON "ChatChunk"("sourceId");

-- CreateIndex
CREATE INDEX "ChatChunk_locale_idx" ON "ChatChunk"("locale");
