-- CreateTable
CREATE TABLE "KnowledgeBase" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "keywords" TEXT[],
    "locale" TEXT NOT NULL DEFAULT 'de',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeBase_locale_visible_idx" ON "KnowledgeBase"("locale", "visible");

-- CreateIndex
CREATE INDEX "KnowledgeBase_category_idx" ON "KnowledgeBase"("category");
