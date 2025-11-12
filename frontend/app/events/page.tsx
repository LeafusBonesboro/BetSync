'use client';

import { useState, useEffect } from 'react';
import LeagueSelector from '@/components/global/LeagueSelector';
import DateScroller from '@/components/global/DateScroller';
import GameCard from '@/components/global/GameCard';
import BottomNav from '@/components/global/BottomNav';
import Spinner from '@/components/global/Spinner';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeAbbr?: string;
  awayAbbr?: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
  homeScore?: number | string | null;
  awayScore?: number | string | null;
  status?: string;
  date?: string;
}

const leagues = [
  {
    id: 'nba',
    name: 'NBA',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
  },
  {
    id: 'nfl',
    name: 'NFL',
    logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
  },
];

export default function EventsPage() {
  const [selectedLeague, setSelectedLeague] = useState('nba');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        let url = '';

        if (selectedLeague === 'nba') {
          url = `${process.env.NEXT_PUBLIC_API_URL}/nba/games?date=${selectedDate}`;
        } else if (selectedLeague === 'nfl') {
          url = `${process.env.NEXT_PUBLIC_API_URL}/espn/scoreboard?year=2025&week=8`;
        }

        const res = await fetch(url);
        const data = await res.json();

        // ✅ Include abbreviations and logos
        const normalized = Array.isArray(data)
          ? data.map((g: any) => ({
              id: g.espnId || g.id || `${g.homeTeam}-${g.awayTeam}`,
              homeTeam: g.homeTeam || g.home,
              awayTeam: g.awayTeam || g.away,
              homeAbbr: g.homeAbbr,
              awayAbbr: g.awayAbbr,
              homeLogo: g.homeLogo,
              awayLogo: g.awayLogo,
              homeScore: g.homeScore ?? null,
              awayScore: g.awayScore ?? null,
              status: g.status || 'Final',
              date: g.startTime || g.date,
            }))
          : [];

        setGames(normalized);
      } catch (err) {
        console.error('Error fetching games:', err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchGames, 300);
    return () => clearTimeout(timeout);
  }, [selectedLeague, selectedDate]);

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-amber-400">Events</h1>
        </div>

        <LeagueSelector
          leagues={leagues}
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
        />

        <DateScroller
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : games.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No games found for this date.
          </p>
        ) : (
          <div className="divide-y divide-gray-800">
            {games.map((game) => (
              <GameCard
                key={game.id || `${game.homeTeam}-${game.awayTeam}`}
                {...game}
                league={selectedLeague}
              />
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
