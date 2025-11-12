-- CreateTable
CREATE TABLE "BetProp" (
    "id" SERIAL NOT NULL,
    "betId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "line" DOUBLE PRECISION,
    "outcome" TEXT,
    "currentStat" DOUBLE PRECISION,
    "sheetRow" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BetProp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BetProp_betId_description_key" ON "BetProp"("betId", "description");

-- AddForeignKey
ALTER TABLE "BetProp" ADD CONSTRAINT "BetProp_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
