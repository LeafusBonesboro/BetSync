"use client";

export interface Bet {
  id: number;
  event: string;
  market: string;
  stake: number;
  odds: number;
  status: string;
  imageUrl?: string;
  link?: string;
  rawText?: string;
  created_at: string; // <-- unified, matches DB + page.tsx
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
    <div className="flex flex-col gap-4 p-4">
      {bets.map((bet) => (
        <div
          key={bet.id}
          className="bg-[#1a1a20] border border-gray-700 rounded-lg p-4 text-white"
        >
          <p className="text-gray-400 text-sm">{bet.created_at}</p>
          <h2 className="text-lg font-bold">{bet.event}</h2>
          <p>{bet.market}</p>
          <p>Stake: ${bet.stake}</p>
          <p>Odds: +{bet.odds}</p>
          <p>Status: {bet.status}</p>

          {bet.imageUrl && (
            <img
              src={bet.imageUrl}
              alt="Bet slip"
              className="mt-2 rounded-lg border border-gray-700"
            />
          )}
        </div>
      ))}
    </div>
  );
}
