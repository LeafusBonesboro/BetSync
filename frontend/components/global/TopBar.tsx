"use client";

import Link from "next/link";
import { useUser } from "@/app/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LinkDiscordButton from "@/components/LinkDiscordButton";

export default function TopBar() {
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      setProfile(data);
    };
    load();
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="w-full bg-[#121218] border-b border-gray-800 py-3 px-6 flex items-center justify-between">
      
      {/* LEFT — LOGO */}
      <Link href="/" className="text-xl font-bold text-white">
        BetSync
      </Link>

      {/* CENTER NAV */}
      <nav className="flex gap-6 text-gray-300">
        <Link href="/bets" className="hover:text-white">Bets</Link>
        <Link href="/settings" className="hover:text-white">Settings</Link>
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-gray-300">

        {/* If logged in */}
        {user && (
          <>
            <span className="text-sm">
              Logged in as <span className="text-white">{user.email}</span>
            </span>

            {/* ⭐ Discord Linked UI ⭐ */}
            {profile?.discord_id ? (
              <div className="flex items-center gap-2">
                <img
                  src={profile.discord_avatar}
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
                <span className="text-white text-sm">
                  {profile.discord_name}
                </span>
              </div>
            ) : (
              <LinkDiscordButton />
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Log out
            </button>
          </>
        )}

        {/* If NOT logged in */}
        {!user && (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log in
          </Link>
        )}

      </div>
    </header>
  );
}
