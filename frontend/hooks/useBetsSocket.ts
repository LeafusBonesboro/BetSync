import { useEffect } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  transports: ["websocket"],
});

export default function useBetsSocket(
  publicUserId: string | null,
  onNewBet: (bet: any) => void
) {
  useEffect(() => {
    if (!publicUserId) return;

    console.log("Joining room:", publicUserId);
    socket.emit("join", publicUserId);

    socket.on("newBet", onNewBet);

    return () => {
      socket.off("newBet", onNewBet);
    };
  }, [publicUserId]);
}
