'use client';

interface GameCardProps {
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
  league: string;
}

export default function GameCard({
  homeTeam,
  awayTeam,
  homeAbbr,
  awayAbbr,
  homeLogo,
  awayLogo,
  homeScore,
  awayScore,
  status,
  date,
}: GameCardProps) {
  const isFinal = status?.toLowerCase().includes('final');
  const formattedTime = date
    ? new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  // ✅ Use ESPN's official NBA logo as fallback (no more local 404s)
  const nbaFallback = 'https://a.espncdn.com/i/teamlogos/nba/500/nba.png';

  return (
    <div className="flex flex-col border-b border-gray-800 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {/* Away Team */}
          <div className="flex items-center gap-2">
            <img
              src={awayLogo || nbaFallback}
              alt={awayTeam}
              className="w-6 h-6 rounded-full object-contain bg-gray-900"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = nbaFallback;
              }}
            />
            <span className="font-semibold text-sm text-white uppercase">
              {awayAbbr || awayTeam}
            </span>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-2 mt-1">
            <img
              src={homeLogo || nbaFallback}
              alt={homeTeam}
              className="w-6 h-6 rounded-full object-contain bg-gray-900"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = nbaFallback;
              }}
            />
            <span className="font-semibold text-sm text-white uppercase">
              {homeAbbr || homeTeam}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-white text-lg font-bold">{awayScore ?? ''}</span>
          <span className="text-white text-lg font-bold mt-1">{homeScore ?? ''}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs ${isFinal ? 'text-gray-400' : 'text-amber-400'}`}>
          {isFinal ? 'Final' : status || formattedTime}
        </span>
        <button className="text-xs text-gray-400 hover:text-amber-400 transition">
          View →
        </button>
      </div>
    </div>
  );
}
