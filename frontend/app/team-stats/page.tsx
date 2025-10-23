'use client';
import { useEffect, useState } from 'react';

export default function TeamStatsComparison() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/espn/team-stats?year=2025&teamId=16,24')
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading stats...</p>;

  if (!teams.length) return <p>No data available</p>;

  const [vikings, chargers] = teams;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Vikings vs Chargers — 2025 Season Comparison
      </h1>

      <div className="overflow-x-auto mt-8 rounded-xl shadow-lg bg-gray-900">
  <table className="table-auto w-full border-collapse text-white">
    <thead className="bg-gray-800">
      <tr>
        <th className="border-b border-gray-700 px-4 py-3 text-left font-semibold text-amber-400">
          Category
        </th>
        <th className="border-b border-gray-700 px-4 py-3 text-right font-semibold text-amber-400">
          Vikings
        </th>
        <th className="border-b border-gray-700 px-4 py-3 text-right font-semibold text-amber-400">
          Chargers
        </th>
      </tr>
    </thead>
    <tbody>
      {vikings?.splits?.categories?.flatMap((cat: any) =>
        cat.stats.map((s: any, i: number) => {
          const match =
            chargers?.splits?.categories
              ?.flatMap((c: any) => c.stats)
              ?.find((x: any) => x.name === s.name);

          return (
            <tr
              key={`${cat.name}-${s.name}-${i}`}
              className={i % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900'}
            >
              <td className="border-b border-gray-800 px-4 py-2 text-sm">
                {s.displayName}
              </td>
              <td className="border-b border-gray-800 px-4 py-2 text-sm text-right">
                {s.value}
              </td>
              <td className="border-b border-gray-800 px-4 py-2 text-sm text-right">
                {match?.value ?? '–'}
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

    </div>
  );
}
