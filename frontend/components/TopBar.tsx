'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo / App Name */}
      <div className="text-xl font-bold tracking-wide">
        Bet<span className="text-amber-400">Sync</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link href="/" className="hover:text-amber-400 transition">
          Bets
        </Link>
        <Link href="/dashboard" className="hover:text-amber-400 transition">
          Dashboard
        </Link>
        <Link href="/research" className="hover:text-amber-400 transition">
          Research
        </Link>
        <Link href="/scoreboard" className="hover:text-amber-400 transition">
          Scoreboard
        </Link>
        <Link href="/espn-data" className="hover:text-amber-400 transition">
          Data
        </Link>
      </div>
    </nav>
  );
}
