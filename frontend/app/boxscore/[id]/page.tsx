'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadBets from '@/components/LoadBets'; // <- your LoadBets component

interface BoxscoreResponse {
  id: string;
  gameInfo: any;
  boxscore: any;
  leaders?: any;
}

export default function BoxscorePage() {
  const { id } = useParams();
  const [data, setData] = useState<BoxscoreResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch ESPN Boxscore
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/espn/boxscore/${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching boxscore:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-400">Loading boxscore...</p>;
  if (!data) return <p className="p-6 text-gray-400">No boxscore found.</p>;

  const { gameInfo, boxscore, leaders } = data;
  const competition = gameInfo?.competitions?.[0];
  const home = competition?.competitors?.find((c: any) => c.homeAway === 'home');
  const away = competition?.competitors?.find((c: any) => c.homeAway === 'away');

  return (
    <div className="max-w-[1600px] mx-auto text-white">
      {/* Top navigation */}
      <div className="sticky top-0 z-20 bg-black border-b border-gray-800 flex gap-6 px-6 py-3 text-sm text-gray-400 backdrop-blur-sm">
        <a href="#team-stats" className="hover:text-amber-400">Team Stats</a>
        <a href="#player-stats" className="hover:text-amber-400">Player Stats</a>
        <a href="#my-bets" className="hover:text-amber-400">My Bets</a>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* CENTER: Game Info + Boxscore + Player Stats */}
        <div className="order-1 lg:order-2 space-y-10 lg:col-span-2">
          <div>
            <h1 className="text-3xl font-bold text-amber-400 mb-4">
              {away?.team?.displayName} @ {home?.team?.displayName}
            </h1>
            <p className="text-gray-500 mb-8">{new Date(competition?.date).toLocaleString()}</p>
          </div>

          {/* Scores */}
          <div className="flex justify-between bg-gray-900 p-4 rounded-lg mb-8">
            <div>
              <p className="text-lg font-semibold">{away?.team?.abbreviation}</p>
              <p className="text-3xl text-amber-400">{away?.score ?? '—'}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{home?.team?.abbreviation}</p>
              <p className="text-3xl text-amber-400">{home?.score ?? '—'}</p>
            </div>
          </div>

          {/* TEAM STATS */}
          {boxscore?.teams && (
            <div id="team-stats" className="overflow-x-auto mb-12">
              <h2 className="text-xl font-semibold mb-4 text-amber-300">Team Statistics</h2>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left px-3 py-2 border-b border-gray-700">Category</th>
                    <th className="text-right px-3 py-2 border-b border-gray-700">
                      {boxscore.teams[0].team.abbreviation}
                    </th>
                    <th className="text-right px-3 py-2 border-b border-gray-700">
                      {boxscore.teams[1].team.abbreviation}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boxscore.teams[0].statistics.map((stat: any, i: number) => {
                    const name = stat.displayName || stat.name;
                    const awayVal = stat.displayValue ?? '—';
                    const match = boxscore.teams[1].statistics.find(
                      (s: any) => s.name === stat.name
                    );
                    const homeVal = match?.displayValue ?? '—';
                    return (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900'}>
                        <td className="px-3 py-2 border-b border-gray-800 text-gray-300">{name}</td>
                        <td className="text-right px-3 py-2 border-b border-gray-800 text-gray-200">
                          {awayVal}
                        </td>
                        <td className="text-right px-3 py-2 border-b border-gray-800 text-gray-200">
                          {homeVal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 🧍 Player Leaders */}
          {leaders && leaders.length > 0 && (
            <div id="player-stats" className="mt-10">
              <h2 className="text-xl font-semibold mb-4 text-amber-300">Player Leaders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {leaders.map((group: any, i: number) => {
                  const category = group.displayName || group.name || `Category ${i}`;
                  return (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <h3 className="text-amber-400 font-semibold text-lg mb-4">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {group.leaders.map((l: any, j: number) => (
                          <div key={j}>
                            <p className="text-gray-200 font-semibold">
                              {l.athlete?.displayName ?? 'N/A'}
                            </p>
                            <p className="text-gray-400 text-sm">{l.team?.displayName ?? ''}</p>
                            {Array.isArray(l.statistics) && l.statistics.length > 0 && (
                              <p className="text-gray-300 mt-1">
                                {l.statistics.map((s: any, k: number) => (
                                  <span key={k}>
                                    {s.displayValue}
                                    {k < l.statistics.length - 1 && ' • '}
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Player Stats Detail */}
          {boxscore?.players && boxscore.players.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4 text-amber-300">Detailed Player Stats</h2>

              {boxscore.players.map((team: any, tIdx: number) => (
                <div key={tIdx} className="mb-8">
                  <h3 className="text-lg text-amber-400 font-bold mb-3">
                    {team.team.displayName}
                  </h3>

                  {team.statistics.map((group: any, gIdx: number) => (
                    <div key={gIdx} className="mb-6">
                      <h4 className="text-md text-gray-300 font-semibold mb-2">
                        {group.displayName}
                      </h4>

                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="text-left px-3 py-2 border-b border-gray-700 text-gray-400">
                              Player
                            </th>
                            {group.labels.map((label: string, i: number) => (
                              <th
                                key={i}
                                className="text-right px-3 py-2 border-b border-gray-700 text-gray-400"
                              >
                                {label}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {group.athletes.map((athlete: any, i: number) => (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900'}
                            >
                              <td className="px-3 py-2 border-b border-gray-800 text-gray-200 font-medium">
                                {athlete.athlete?.displayName ?? '—'}
                                {athlete.athlete?.position?.abbreviation && (
                                  <span className="text-gray-500 text-xs ml-1">
                                    ({athlete.athlete.position.abbreviation})
                                  </span>
                                )}
                              </td>

                              {athlete.stats.map((stat: string, j: number) => (
                                <td
                                  key={j}
                                  className="text-right px-3 py-2 border-b border-gray-800 text-gray-200"
                                >
                                  {stat || '—'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: My Bets */}
        <div id="my-bets" className="space-y-6 order-3">
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <LoadBets gameId={id as string} />
          </div>
        </div>
      </div>
    </div>
  );
}
