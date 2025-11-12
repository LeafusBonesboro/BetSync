import React, { useEffect, useState } from "react";

interface Game {
  id: string;
  espnId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  spread: number;
  total: number;
  moneylineHome: number;
  moneylineAway: number;
}

const NbaGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("http://localhost:4000/nba/games");
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching NBA games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading games...</p>;
  }

  if (games.length === 0) {
    return <p className="text-gray-500 text-center mt-10">No games found.</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
  <div
    key={game.id || game.espnId}
    className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-all duration-200"
  >
    <h2 className="text-xl font-bold text-center mb-2">
      {game.awayTeam} @ {game.homeTeam}
    </h2>
    <p className="text-sm text-center text-gray-600 mb-2">
      🕒 {new Date(game.startTime).toLocaleString()}
    </p>

    <div className="flex flex-col items-center gap-2 text-sm">
      <div>
        <span className="font-semibold">Spread:</span>{" "}
        {game.spread ? game.spread : "N/A"}
      </div>
      <div>
        <span className="font-semibold">Total:</span>{" "}
        {game.total ? game.total : "N/A"}
      </div>
      <div>
        <span className="font-semibold">Moneyline (Home):</span>{" "}
        {game.moneylineHome || "N/A"}
      </div>
      <div>
        <span className="font-semibold">Moneyline (Away):</span>{" "}
        {game.moneylineAway || "N/A"}
      </div>
    </div>
  </div>
))}

    </div>
  );
};

export default NbaGames;
