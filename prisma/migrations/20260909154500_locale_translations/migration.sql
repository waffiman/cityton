-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "detailEn" JSONB,
ADD COLUMN     "extraTagEn" TEXT,
ADD COLUMN     "familyEn" TEXT,
ADD COLUMN     "metricsEn" JSONB,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "tagEn" TEXT,
ADD COLUMN     "useCasesEn" TEXT[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentHtmlEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "applicationEn" TEXT,
ADD COLUMN     "certificationEn" TEXT;
