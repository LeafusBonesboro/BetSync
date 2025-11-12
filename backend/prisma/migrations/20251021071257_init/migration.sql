-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "stake" DOUBLE PRECISION NOT NULL,
    "odds" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);
