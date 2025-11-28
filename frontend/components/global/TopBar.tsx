"use client";

import Link from "next/link";
import { useUser } from "@/app/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="w-full bg-[#121218] border-b border-gray-800 px-4 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* LOGO + NAV */}
        <div className="flex items-center justify-between md:justify-start w-full gap-6">

          <Link href="/" className="text-xl font-bold text-white">
            BetSync
          </Link>

          <nav className="flex gap-4 text-gray-300 text-sm md:text-base">
            <Link href="/bets" className="hover:text-white">Bets</Link>
            <Link href="/settings" className="hover:text-white">Settings</Link>
            <Link href="/chat" className="hover:text-white">Chat</Link>
          </nav>
        </div>

        {/* RIGHT SIDE — LOGIN / LOGOUT ONLY */}
        <div className="flex items-center gap-3 text-gray-300">

          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs md:text-sm"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs md:text-sm"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
