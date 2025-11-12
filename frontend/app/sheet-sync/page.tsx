'use client';
import { useState } from 'react';

export default function SheetSyncPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [props, setProps] = useState<any[]>([]);

  const handleSync = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:4000/bet-props/sync'
, {
        method: 'POST',
      });
      const data = await res.json();
      setMessage(data.message || '✅ Sync complete');

      // optional: if your backend exposes GET /api/bet-props
      const list = await fetch('http://localhost:4000/api/bet-props');
      if (list.ok) {
        const items = await list.json();
        setProps(items);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error syncing sheet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🧾 Google Sheet Bet Prop Sync
        </h1>

        <button
          onClick={handleSync}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 transition"
        >
          {loading ? 'Syncing...' : 'Sync from Sheet'}
        </button>

        {message && (
          <p className="text-center mt-4 text-lg">{message}</p>
        )}

        {props.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Synced Props</h2>
            <ul className="divide-y divide-gray-700">
              {props.map((p) => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span>{p.playerName}</span>
                  <span className="text-gray-400">{p.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
