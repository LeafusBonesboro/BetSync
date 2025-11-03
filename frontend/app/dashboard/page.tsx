'use client';

import { useState, useEffect } from "react";
import axios from "axios";

interface Player {
  id: number;
  fullName: string;
  team: string | null;
  position: string | null;
}

export default function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPos, setSelectedPos] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const BACKEND_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        const url = selectedPos
          ? `${BACKEND_URL}/espn/players?position=${selectedPos}`
          : `${BACKEND_URL}/espn/players`;

        const { data } = await axios.get<Player[]>(url);
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [selectedPos]);

  return (
    <div className="p-6 space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-3">
        {["QB", "WR", "RB", "TE"].map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPos(pos === selectedPos ? null : pos)}
            className={`px-4 py-2 rounded-full border ${
              selectedPos === pos
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-purple-800 border-gray-300 hover:bg-gray-100"
            } transition`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Player list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p) => (
          <div
  key={p.id}
  className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md"
>
  <h3 className="font-semibold text-lg text-blue-600">{p.fullName}</h3>
  <p className="text-sm text-purple-600">{p.team}</p>
  <p className="text-sm text-purple-500">{p.position}</p>
</div>

        ))}
      </div>
    </div>
  );
}
