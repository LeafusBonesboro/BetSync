"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/AuthProvider";
import { apiFetch } from "@/lib/apiFetch";
import BetsList, { Bet } from "@/components/BetsList";
import JoinDiscordServer from "@/components/JoinDiscordServer";

export default function BetsPage() {
  const { user, loading: authLoading } = useUser();

  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<any>(null);

  // ⭐ Hooks must ALWAYS run — no early returns above this line
  useEffect(() => {
    if (!user) return; // safe — inside the hook, not above it

    apiFetch("/bets/by-user")
      .then(async (res) => {
        const json = await res.json();

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
              created_at: b.created_at ?? "",
            }))
          : [];

        setBets(normalized);
      })
      .catch((err) => {
        setDebug({ error: err?.message || err });
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ⭐ After hydration but before user state
  if (authLoading) {
    return <p className="text-white p-6 text-center">Loading session…</p>;
  }

  if (!user) {
    return <p className="text-white p-6 text-center">You must log in.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-4">Your Bets</h1>

      {loading ? (
        <p className="text-white">Loading…</p>
      ) : bets.length === 0 ? (
        // ⭐ Empty-state UI
        <div className="text-center text-white mt-10 space-y-4">
          <h2 className="text-xl font-semibold">No bets yet</h2>

          <p className="text-gray-300 max-w-md mx-auto">
            To add your first bet, join our Discord server and share a screenshot
            of a bet slip from your sportsbook directly in the bet-sharing channel.
          </p>

          <JoinDiscordServer />

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            After joining, open your sportsbook → tap “Share” → select Discord →
            choose our server → send the slip. Your bets will appear here
            automatically.
          </p>
        </div>
      ) : (
        <BetsList bets={bets} />
      )}
    </div>
  );
}
