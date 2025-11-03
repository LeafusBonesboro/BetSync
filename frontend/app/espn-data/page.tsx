'use client';

import { useState } from 'react';

export default function EspnDataExplorer() {
  const [endpoint, setEndpoint] = useState('boxscore');
  const [param, setParam] = useState('401547438');
  const [extraParams, setExtraParams] = useState({ week: '8', year: '2025' });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_URL}/espn/${endpoint}`;

      if (['boxscore', 'player', 'roster'].includes(endpoint)) url += `/${param}`;
      if (endpoint === 'scoreboard')
        url += `?week=${extraParams.week}&year=${extraParams.year}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 text-white min-h-screen bg-gray-950">
      <h1 className="text-3xl font-bold text-amber-400 mb-6">🏈 ESPN Data Explorer</h1>

      {/* Endpoint & parameter controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={endpoint}
          onChange={(e) => {
            setEndpoint(e.target.value);
            setData(null);
          }}
          className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
        >
          <option value="boxscore">Boxscore (Game Summary)</option>
          <option value="scoreboard">Scoreboard (All Games)</option>
          <option value="teams">Teams</option>
          <option value="roster">Team Roster</option>
          <option value="player">Player Info</option>
          <option value="standings">Standings</option>
        </select>

        {['boxscore', 'player', 'roster'].includes(endpoint) && (
          <input
            value={param}
            onChange={(e) => setParam(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-md w-64 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder={
              endpoint === 'boxscore'
                ? 'Enter eventId (e.g. 401547438)'
                : endpoint === 'player'
                ? 'Enter playerId'
                : 'Enter teamId'
            }
          />
        )}

        {endpoint === 'scoreboard' && (
          <>
            <input
              type="number"
              value={extraParams.week}
              onChange={(e) => setExtraParams({ ...extraParams, week: e.target.value })}
              className="bg-gray-800 text-white px-3 py-2 rounded-md w-24 border border-gray-700"
              placeholder="Week"
            />
            <input
              type="number"
              value={extraParams.year}
              onChange={(e) => setExtraParams({ ...extraParams, year: e.target.value })}
              className="bg-gray-800 text-white px-3 py-2 rounded-md w-28 border border-gray-700"
              placeholder="Year"
            />
          </>
        )}

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">❌ Error: {error}</p>}
      {loading && <p className="text-gray-400 mb-4">Loading data...</p>}

      {data && (
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 overflow-auto max-h-[80vh]">
          <pre className="text-xs text-amber-200 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {!data && !loading && !error && (
        <p className="text-gray-500 italic mt-6">
          Choose an endpoint above, enter parameters (if needed), and click{' '}
          <span className="text-amber-400 font-semibold">Fetch</span> to explore ESPN API data.
        </p>
      )}
    </div>
  );
}
