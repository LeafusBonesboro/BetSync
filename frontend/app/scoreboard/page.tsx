'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // 🟢 this fixes "Cannot find name 'Link'"

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
  const [games, setGames] = useState<Game[]>([]);
  const [year, setYear] = useState(2025);
  const [week, setWeek] = useState(8);
  const [loading, setLoading] = useState(true);

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
    {loading ? (
      <p>Loading games...</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => {
          const home = game.home;
          const away = game.away;
          const homeScore = game.homeScore ?? null;
          const awayScore = game.awayScore ?? null;

          return (
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
                    {away}{' '}
                    {awayScore && (
                      <span className="text-amber-400 font-semibold">{awayScore}</span>
                    )}
                  </p>
                  <p className="text-gray-300">
                    {home}{' '}
                    {homeScore && (
                      <span className="text-amber-400 font-semibold">{homeScore}</span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/boxscore/${game.id}`}
                  className="text-amber-400 font-semibold hover:underline self-center"
                >
                  View Boxscore →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}
