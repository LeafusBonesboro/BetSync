'use client';

import { useEffect, useState } from 'react';
import { RefreshCcw, ChevronDown } from 'lucide-react';

interface Bet {
  id: number;
  event: string;
  market: string;
  odds: number;
  status: string;
  imageUrl?: string;
}

interface LoadBetsProps {
  gameId?: string;
}

export default function LoadBets({ gameId }: LoadBetsProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'game'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadBets = async () => {
    try {
      setRefreshing(true);
      const endpoint =
        filter === 'game' && gameId
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/bets/game/${gameId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/bets`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setBets(data);
    } catch (error) {
      console.error('Failed to load bets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBets();
  }, [filter, gameId]);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-amber-400">Recent Bets</h2>

        {/* Dropdown + Reload */}
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'game')}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Bets</option>
            <option value="game">This Game Only</option>
          </select>

          <button
            onClick={loadBets}
            disabled={refreshing}
            className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-200 text-sm transition"
          >
            <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Reloading...' : 'Reload'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bets.length === 0 ? (
        <p className="text-gray-500 text-sm">No bets found.</p>
      ) : (
        bets.map((bet) => (
          <div
            key={bet.id}
            className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-4 rounded-xl transition"
          >
            <p className="font-medium text-gray-200">{bet.event}</p>
            <p className="text-sm text-gray-400">{bet.market}</p>
            <p className="text-sm text-gray-400">Odds: {bet.odds}</p>
            <p className="text-sm text-gray-400">
              Status:{' '}
              <span
                className={
                  bet.status === 'Won'
                    ? 'text-green-400'
                    : bet.status === 'Lost'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }
              >
                {bet.status}
              </span>
            </p>

            {bet.imageUrl && (
              <img
                src={bet.imageUrl}
                alt="Bet Slip"
                className="mt-2 rounded-md border border-gray-700 max-w-sm"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
