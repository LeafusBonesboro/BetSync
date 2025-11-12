'use client';
import { useEffect, useState } from 'react';

type BetProp = {
  betId: number;
  playerName: string;
  description: string;
  outcome?: string | null;
  sheetRow?: number;
  currentStat?: number | null;
  target?: number | null;
  category?: string | null;
};

export default function BetPropsPage() {
  const [props, setProps] = useState<BetProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Win' | 'Lose' | 'Pending'>('All');

  useEffect(() => {
    const url = new URL('http://localhost:4000/bet-props');
    url.searchParams.append('gameId', '401772636'); // example ESPN game ID

    fetch(url.toString())
      .then((res) => res.json())
      .then(setProps)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center p-8 text-gray-400">Loading props...</div>;

  const filtered =
    filter === 'All'
      ? props
      : props.filter((p) => (p.outcome ?? 'Pending') === filter);

  const outcomeColor = (outcome?: string | null) => {
    switch (outcome) {
      case 'Win':
        return 'text-green-400 font-semibold';
      case 'Lose':
        return 'text-red-400 font-semibold';
      default:
        return 'text-gray-400 italic';
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📊 Synced Bet Props</h1>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-4">
        {['All', 'Win', 'Lose', 'Pending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === f
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-sm bg-slate-900">
          <thead>
            <tr className="bg-slate-800 text-gray-300">
              <th className="px-4 py-2 text-left">Bet ID</th>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Outcome</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Sheet Row</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr
                key={`${p.betId}-${p.sheetRow}`}
                className="border-b border-slate-800 hover:bg-slate-800/70 transition"
              >
                <td className="px-4 py-2 text-gray-400">{p.betId}</td>
                <td className="px-4 py-2 font-semibold">{p.playerName}</td>
                <td className="px-4 py-2">{p.description}</td>
                <td className="px-4 py-2 text-gray-300">{p.category ?? '—'}</td>
                <td className={`px-4 py-2 ${outcomeColor(p.outcome)}`}>
                  {p.outcome ?? 'Pending'}
                </td>
                <td className="px-4 py-2 text-amber-300">
                  {p.currentStat != null && p.target != null
                    ? `${p.currentStat} / ${p.target}`
                    : '—'}
                </td>
                <td className="px-4 py-2 text-gray-400">{p.sheetRow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-6 italic">
          No matching props found for <span className="text-amber-400">{filter}</span>.
        </p>
      )}
    </div>
  );
}
