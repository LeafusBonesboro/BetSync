// components/ParsedBetCard.tsx
import React from 'react';

type ParsedBet = {
  event: string;
  market: string;
  odds: number;
  stake: number;
  status: string;
  rawText: string;
};

interface Props {
  bet: ParsedBet;
}

export const ParsedBetCard: React.FC<Props> = ({ bet }) => {
  return (
    <div className="rounded-xl shadow-md p-4 border bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{bet.event}</h2>
      <p><strong>Market:</strong> {bet.market}</p>
      <p><strong>Odds:</strong> {bet.odds}</p>
      <p><strong>Stake:</strong> ${bet.stake}</p>
      <p><strong>Status:</strong> {bet.status}</p>

      <details className="mt-3 text-sm text-gray-600">
        <summary className="cursor-pointer underline">Raw OCR</summary>
        <pre className="whitespace-pre-wrap mt-1">{bet.rawText}</pre>
      </details>
    </div>
  );
};
