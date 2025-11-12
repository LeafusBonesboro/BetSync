'use client';

import { Bell } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F] text-white">
      {/* Header */}
      <header className="bg-linear-to-b from-[#123C8C] to-[#0B0B0F] px-4 pt-10 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          {/* Avatar */}
          <div className="w-10 h-10 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center">
            K
          </div>

          {/* Right buttons */}
          <div className="flex gap-3 items-center">
            <Bell className="w-5 h-5 text-white/80" />
            <button className="bg-[#1E4FB1] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
              <span>Link Accounts</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-[#1A1F2E] flex items-center rounded-full px-4 py-2 text-gray-400 text-sm">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
          />
        </div>
      </header>

      {/* Profile Progress */}
      <section className="px-4 mt-6">
        <div className="bg-[#111520] border border-gray-800 rounded-2xl p-5">
          <h3 className="text-gray-300 text-sm mb-2">Complete your profile</h3>
          <p className="text-white font-bold text-lg mb-3">0% Complete</p>
          <button className="bg-[#1E4FB1] w-full py-2 rounded-xl text-sm font-semibold hover:bg-[#2c6ef4]">
            Link account
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex justify-around px-4 mt-6">
        {[
          { label: 'Invite', icon: '😊' },
          { label: 'Discover', icon: '🧭' },
          { label: 'Calendar', icon: '🗓️' },
          { label: 'Your Bets', icon: '📋' },
        ].map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center text-gray-300 text-xs"
          >
            <div className="w-12 h-12 bg-[#1A1F2E] rounded-full flex items-center justify-center mb-1">
              <span className="text-lg">{item.icon}</span>
            </div>
            {item.label}
          </button>
        ))}
      </section>

      {/* Referral Banner */}
      <section className="px-4 mt-6">
        <div className="bg-green-700 hover:bg-green-600 transition rounded-xl text-center py-3 text-white font-medium">
          Refer friends and get up to $100 →
        </div>
      </section>

      {/* Feed Section */}
      <section className="px-4 mt-6 flex-1 overflow-y-auto pb-24">
        <h2 className="text-lg font-semibold mb-4">Feed</h2>

        {/* Post composer */}
        <div className="bg-[#111520] border border-gray-800 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center">
            K
          </div>
          <input
            placeholder="Share a thought or post a bet"
            className="bg-transparent flex-1 text-sm outline-none text-gray-300"
          />
        </div>

        {/* Example Post / Ad */}
        <div className="bg-[#1A1F2E] border border-gray-800 rounded-xl p-4 mb-4">
          <div className="text-green-400 font-semibold text-sm mb-1">
            CLAIM $200
          </div>
          <p className="text-gray-300 text-xs mb-2">
            Bet $5 & Get $200 in Bonus Bets Win or Lose!
          </p>
          <button className="bg-green-600 hover:bg-green-500 text-sm font-semibold px-3 py-1.5 rounded-md">
            Bet Now
          </button>
        </div>

        {/* Example Feed Post */}
        <div className="bg-[#111520] border border-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full" />
            <div>
              <p className="text-sm font-semibold">JaysPlays</p>
              <p className="text-xs text-gray-500">15h ago</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Soccer from the Bot! Let’s get a big start!
          </p>
          <div className="bg-[#1A1F2E] border border-gray-800 rounded-lg p-3 text-sm">
            <p className="text-gray-400">
              Under 9.5 • Total Corners — <span className="text-amber-400">1.1u</span>
            </p>
            <p className="text-gray-400 mt-1 text-xs">RSO vs ELC</p>
          </div>
        </div>
      </section>
    </div>
  );
}
