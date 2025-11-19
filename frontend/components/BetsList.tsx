import React from "react";

interface Bet {
  id: number;
  event: string;
  market: string;
  stake: number;
  odds: number;
  status: string;
  imageUrl?: string;
  link?: string;
  rawText?: string;
  createdAt: string;
}

interface BetsListProps {
  bets: Bet[];
}

export default function BetsList({ bets }: BetsListProps) {
  if (!bets || bets.length === 0) {
    return (
      <p className="text-white p-6 text-center">
        You have no bets yet.
      </p>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bets.map((bet) => (
        <div
          key={bet.id}
          className="border rounded-xl p-4 shadow bg-white"
        >
          <h2 className="text-xl font-semibold">{bet.event}</h2>
          <p>{bet.market}</p>
          <p className="text-sm text-gray-600 mt-2">
            Stake: ${bet.stake} | Odds: {bet.odds}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Status: {bet.status}
          </p>
        </div>
      ))}
    </div>
  );
}
