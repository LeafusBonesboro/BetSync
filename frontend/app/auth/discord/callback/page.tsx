"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DiscordCallback() {
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      const code = new URLSearchParams(window.location.search).get("code");
      console.log("📥 Received OAuth code:", code);

      if (!code) {
        router.push("/login?error=missing_code");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        console.log("📡 Callback POST response status:", res.status);
        console.log("📡 Callback POST headers:", [...res.headers.entries()]);

        router.push("/dashboard");
      } catch (err) {
        console.error("❌ Callback POST failed:", err);
      }
    }

    finishLogin();
  }, [router]);

  return <div>Logging you in…</div>;
}
