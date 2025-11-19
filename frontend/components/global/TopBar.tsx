"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[#121218] border-b border-gray-800 py-3 px-6 flex items-center justify-between">
      {/* LEFT — LOGO */}
      <Link href="/" className="text-xl font-bold text-white">
        BetSync
      </Link>

      {/* CENTER — NAV LINKS */}
      <nav className="flex gap-6 text-gray-300">
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>

        <Link href="/bets" className="hover:text-white">
          Bets
        </Link>

        <Link href="/analysis" className="hover:text-white">
          Analysis
        </Link>
      </nav>

      {/* RIGHT — USER SECTION */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300">
              {user.discordName || user.username}
            </span>
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              document.dispatchEvent(new Event("open-login"))
            }
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
