/*
  Warnings:

  - You are about to drop the column `confidence` on the `ExpertAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `markdown` on the `ExpertAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `seasonYear` on the `ExpertAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `team1` on the `ExpertAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `team2` on the `ExpertAnalysis` table. All the data in the column will be lost.
  - Added the required column `parsedData` to the `ExpertAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcript` to the `ExpertAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "eventId" TEXT;

-- AlterTable
ALTER TABLE "ExpertAnalysis" DROP COLUMN "confidence",
DROP COLUMN "markdown",
DROP COLUMN "seasonYear",
DROP COLUMN "team1",
DROP COLUMN "team2",
ADD COLUMN     "filePath" TEXT,
ADD COLUMN     "parsedData" JSONB NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "transcript" TEXT NOT NULL;
