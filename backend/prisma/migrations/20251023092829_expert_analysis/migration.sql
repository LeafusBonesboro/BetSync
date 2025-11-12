-- CreateTable
CREATE TABLE "ExpertAnalysis" (
    "id" SERIAL NOT NULL,
    "expertName" TEXT NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,
    "seasonYear" INTEGER NOT NULL,
    "markdown" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpertAnalysis_pkey" PRIMARY KEY ("id")
);
