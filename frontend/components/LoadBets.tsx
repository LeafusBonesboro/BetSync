'use client';

import { useEffect, useState } from 'react';

interface Bet {
  id: number;
  event: string;
  market: string;
  currentStat?: number;
  status?: string;
}

export default function LoadBets({ gameId }: { gameId: string }) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchLiveBets = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bets/live/${gameId}`);
        const json = await res.json();
        setBets(json.bets || []);
      } catch (err) {
        console.error('Error fetching live bets:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchLiveBets();

    // Auto-refresh every 15s
    const interval = setInterval(fetchLiveBets, 15000);
    return () => clearInterval(interval);
  }, [gameId]);

  if (loading) return <p className="p-4 text-gray-500">Loading live bets...</p>;
  if (!bets.length) return <p className="p-4 text-gray-500">No bets found for this game.</p>;

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xl font-semibold text-amber-400 mb-3">Live Bets</h3>
      {bets.map((bet) => (
        <div
          key={bet.id}
          className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex justify-between items-center hover:border-amber-400 transition"
        >
          <div>
            <p className="font-medium text-gray-200">{bet.market}</p>
            {bet.currentStat !== undefined && (
              <p className="text-gray-400 text-sm">Current: {bet.currentStat}</p>
            )}
          </div>
          <div
            className={`font-semibold ${
              bet.status === '✅ Hit'
                ? 'text-green-400'
                : bet.status === '🕓 Pending'
                ? 'text-yellow-400'
                : 'text-gray-400'
            }`}
          >
            {bet.status || '—'}
          </div>
        </div>
      ))}
    </div>
  );
}
