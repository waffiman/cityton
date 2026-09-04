-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'image',
    "posterUrl" TEXT,
    "projectDe" TEXT NOT NULL,
    "filmDe" TEXT NOT NULL,
    "projectEn" TEXT NOT NULL,
    "filmEn" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryItem_url_key" ON "GalleryItem"("url");

-- CreateIndex
CREATE INDEX "GalleryItem_visible_sortOrder_idx" ON "GalleryItem"("visible", "sortOrder");
