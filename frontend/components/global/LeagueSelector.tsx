'use client';

interface League {
  id: string;
  name: string;
  logo: string;
}

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: string;
  onSelectLeague: (leagueId: string) => void; // ✅ Add this
}

export default function LeagueSelector({
  leagues,
  selectedLeague,
  onSelectLeague,
}: LeagueSelectorProps) {
  return (
    <div className="flex justify-center gap-4 py-2 bg-[#0B0B0F]/90 border-b border-gray-800">
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => onSelectLeague(league.id)} // ✅ Use here
          className={`flex flex-col items-center text-sm ${
            selectedLeague === league.id
              ? 'text-amber-400 font-semibold'
              : 'text-gray-400 hover:text-amber-300'
          }`}
        >
          <img
            src={league.logo}
            alt={league.name}
            className="w-8 h-8 mb-1 object-contain"
          />
          {league.name}
        </button>
      ))}
    </div>
  );
}
