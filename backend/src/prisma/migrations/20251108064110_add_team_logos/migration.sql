/*
  Warnings:

  - The primary key for the `NbaGame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `evSpread` on the `NbaGame` table. All the data in the column will be lost.
  - You are about to drop the column `evTotal` on the `NbaGame` table. All the data in the column will be lost.
  - You are about to drop the column `modelSpread` on the `NbaGame` table. All the data in the column will be lost.
  - You are about to drop the column `modelTotal` on the `NbaGame` table. All the data in the column will be lost.
  - The `id` column on the `NbaGame` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NbaGame" DROP CONSTRAINT "NbaGame_pkey",
DROP COLUMN "evSpread",
DROP COLUMN "evTotal",
DROP COLUMN "modelSpread",
DROP COLUMN "modelTotal",
ADD COLUMN     "awayAbbr" TEXT,
ADD COLUMN     "awayLogo" TEXT,
ADD COLUMN     "awayScore" INTEGER,
ADD COLUMN     "homeAbbr" TEXT,
ADD COLUMN     "homeLogo" TEXT,
ADD COLUMN     "homeScore" INTEGER,
ADD COLUMN     "status" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "spread" DROP NOT NULL,
ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "moneylineHome" DROP NOT NULL,
ALTER COLUMN "moneylineAway" DROP NOT NULL,
ADD CONSTRAINT "NbaGame_pkey" PRIMARY KEY ("id");
