"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/app/providers/AuthProvider";

export default function LinkDiscordButton() {
  const supabase = createClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleLinkDiscord = async () => {
    setLoading(true);

    const { error } = await supabase.auth.linkIdentity({
      provider: "discord",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/discord-callback`,
      },
    });

    if (error) {
      console.error("Discord link error:", error);
    }
  };

  return (
    <button
      onClick={handleLinkDiscord}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
    >
      {loading ? "Linking..." : "Link Discord"}
    </button>
  );
}
