"use client";

import { useEffect, useState } from "react";

interface Bet {
  id: number;
  event: string;
  market: string;
  odds: number;
  status: string;
  imageUrl?: string;
}

export default function LoadBets() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bets`);
        const data = await res.json();
        setBets(data);
      } catch (error) {
        console.error("Failed to load bets:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBets();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-blue-400">Recent Bets</h2>
      {bets.length === 0 && <p>No bets found.</p>}
      {bets.map((bet) => (
        <div key={bet.id} className="bg-gray-800 p-4 rounded-xl">
          <p className="font-medium">{bet.event}</p>
          <p className="text-sm text-gray-400">{bet.market}</p>
          <p className="text-sm">Odds: {bet.odds}</p>
          <p className="text-sm">Status: {bet.status}</p>
          {bet.imageUrl && (
            <img
              src={bet.imageUrl}
              alt="Bet Slip"
              className="mt-2 rounded-md max-w-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}
