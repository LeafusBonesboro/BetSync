"use client";
import { useEffect, useState } from "react";

interface Bet {
  id: number;
  event: string;
  market: string;
  stake: number;
  odds: number;
  status: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
}

export default function BetsList() {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const fetchBets = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bets`);
      const data = await res.json();
      setBets(data);
    };
    fetchBets();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bets.map((bet) => (
        <div key={bet.id} className="border rounded-xl p-4 shadow bg-white">
          <h2 className="text-xl font-semibold">{bet.event}</h2>
          <p>{bet.market}</p>
          <p className="text-gray-600">Stake: ${bet.stake}</p>
          <p className="text-gray-600">Odds: {bet.odds}</p>
          <p className="font-semibold text-blue-600">{bet.status}</p>
          {bet.imageUrl && (
            <img src={bet.imageUrl} alt="Bet slip" className="mt-2 rounded-lg w-full" />
          )}
          {bet.link && (
            <a
              href={bet.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 underline block mt-2"
            >
              View on Discord
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
