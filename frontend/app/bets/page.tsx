"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import BetsList from "@/components/BetsList";
import useBetsSocket from "@/hooks/useBetsSocket";

interface Bet {
  id: number;
  event: string;
  market: string;
  stake: number;
  odds: number;
  status: string;
  imageUrl?: string;
  link?: string;
  rawText?: string;
  createdAt: string;
}

export default function BetsPage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐ FETCH INITIAL BETS
  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bets/by-user`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setBets(Array.isArray(data) ? data : []))
      .catch(() => setBets([]))
      .finally(() => setLoading(false));
  }, [user]);

  // ⭐ REAL-TIME SOCKET UPDATES
  useBetsSocket(user?.id, (newBet) => {
    setBets(prev => [newBet, ...prev]);   // 🔥 instantly update UI
  });

  if (!user)
    return (
      <p className="text-white p-6 text-lg text-center">
        You must log in to view your bets.
      </p>
    );

  if (loading)
    return <p className="text-white p-6 text-center">Loading…</p>;

  return <BetsList bets={bets} />;
}
