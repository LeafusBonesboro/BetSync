'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Game {
  id: string;
  name: string;
  shortName: string;
  date: string;
  home: string;
  away: string;
  homeScore?: string | null;
  awayScore?: string | null;
  status?: string;
}

export default function ScoreboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 👇 Initialize from URL (or defaults)
  const [year, setYear] = useState<number>(() => Number(searchParams.get('year')) || 2025);
  const [week, setWeek] = useState<number>(() => Number(searchParams.get('week')) || 8);

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Keep URL in sync when year/week changes (so Back works)
  useEffect(() => {
    router.replace(`/scoreboard?year=${year}&week=${week}`);
  }, [year, week, router]);

  // 📡 Fetch games whenever year/week changes
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/espn/scoreboard?year=${year}&week=${week}`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching scoreboard:', err);
        setLoading(false);
      });
  }, [year, week]);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-amber-400 mb-6">NFL Scoreboard</h1>

      {/* --- Filters --- */}
      <div className="flex gap-4 mb-6">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w}>Week {w}</option>
          ))}
        </select>
      </div>

      {/* --- Games --- */}
      {loading ? (
        <p>Loading games...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md hover:shadow-amber-500/20 transition"
            >
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-lg text-amber-300">{game.shortName}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(game.date).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-300">
                    {game.away}{' '}
                    {game.awayScore && (
                      <span className="text-amber-400 font-semibold">{game.awayScore}</span>
                    )}
                  </p>
                  <p className="text-gray-300">
                    {game.home}{' '}
                    {game.homeScore && (
                      <span className="text-amber-400 font-semibold">{game.homeScore}</span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/boxscore/${game.id}?year=${year}&week=${week}`}
                  className="text-amber-400 font-semibold hover:underline self-center"
                >
                  View Boxscore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
