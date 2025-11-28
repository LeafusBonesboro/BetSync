"use client";

export interface Bet {
  id: number;
  imageUrl: string;
  createdAt?: string;
}

interface BetsListProps {
  bets: Bet[];
}

export default function BetsList({ bets }: BetsListProps) {
  if (!bets || bets.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-10">
        You have no bets yet.
      </p>
    );
  }

  return (
    <div className="space-y-8 mt-6 px-4 flex flex-col items-center">
      {bets.map((bet) => (
        <div
          key={bet.id}
          className="bg-[#1b1b22] border border-gray-800 rounded-xl p-4 w-full max-w-xl"
        >
          {/* Timestamp */}
          <p className="text-xs text-gray-500 mb-3">
            {bet.createdAt
              ? new Date(bet.createdAt).toLocaleString()
              : ""}
          </p>

          {/* BET SLIP IMAGE */}
          <img
            src={bet.imageUrl}
            alt="Bet Slip"
            className="rounded-lg border border-gray-700 w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      ))}
    </div>
  );
}
