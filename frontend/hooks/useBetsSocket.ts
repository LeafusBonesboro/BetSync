"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function useBetsSocket(
  userId: string | undefined,
  onNewBet: (bet: any) => void
) {
  useEffect(() => {
    if (!userId) return; // 🚫 return NOTHING (not a function!)

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    // join user's personal room
    socket.emit("join", userId);

    // listen for new bets
    socket.on("bet:new", (bet) => {
      onNewBet(bet);
    });

    // ✅ CLEANUP MUST ALWAYS RETURN A FUNCTION
    return () => {
      socket.disconnect();
    };
  }, [userId, onNewBet]);
}
