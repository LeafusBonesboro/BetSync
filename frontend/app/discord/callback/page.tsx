"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscordCallback() {
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        router.push("/login?error=missing_code");
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code }),
});


      router.push("/dashboard");
    }

    finishLogin();
  }, [router]);

  return <div>Logging you in…</div>;
}
