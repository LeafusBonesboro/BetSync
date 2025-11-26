"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/lib/apiFetch";
import BetsList, { Bet } from "@/components/BetsList";

export default function BetsPage() {
  const { user } = useUser();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    apiFetch("/bets/by-user")
      .then(async (res) => {
        const json = await res.json();

        // 🔥 Ensure created_at always exists
        const normalized: Bet[] = Array.isArray(json)
          ? json.map((b: any) => ({
              id: b.id,
              event: b.event,
              market: b.market,
              stake: b.stake,
              odds: b.odds,
              status: b.status,
              imageUrl: b.image_url,
              link: b.link,
              rawText: b.raw_text,
              created_at: b.created_at ?? "", // unified field
            }))
          : [];

        setBets(normalized);

        setDebug({
          rawBackend: json,
          normalized,
          count: normalized.length,
        });
      })
      .catch((err) => {
        setDebug({ error: err?.message || err });
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return <p className="text-white p-6 text-center">You must log in.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-4">Your Bets</h1>

      {/* Debug Panel */}
     

      {loading ? <p className="text-white">Loading…</p> : <BetsList bets={bets} />}
    </div>
  );
}
