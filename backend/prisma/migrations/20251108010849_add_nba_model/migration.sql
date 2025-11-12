-- CreateTable
CREATE TABLE "NbaGame" (
    "id" TEXT NOT NULL,
    "espnId" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "spread" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "moneylineHome" INTEGER NOT NULL,
    "moneylineAway" INTEGER NOT NULL,
    "modelTotal" DOUBLE PRECISION,
    "modelSpread" DOUBLE PRECISION,
    "evTotal" DOUBLE PRECISION,
    "evSpread" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NbaGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NbaGame_espnId_key" ON "NbaGame"("espnId");
