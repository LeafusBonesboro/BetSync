"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscordCallback() {
  const router = useRouter();

  useEffect(() => {
    // OAuth now handled entirely by the backend.
    // Frontend does NOT exchange the code anymore.
    console.log("⚠️ Frontend callback reached — backend should already have logged you in.");

    router.push("/dashboard");
  }, [router]);

  return <div>Logging you in…</div>;
}
