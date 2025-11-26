"use client";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#0d0d11] flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl text-center">
        
        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          BetSync — One place for <span className="text-amber-400">all your bets.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl mt-6 leading-relaxed">
          Sportsbooks make it hard to find your wagers. BetSync fixes that with a clean, unified feed that automatically organizes every bet slip you share.
        </p>

        {/* Pain Points */}
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-10 text-left mx-auto">
          <h2 className="text-xl text-white font-semibold mb-3">The Problem</h2>
          <ul className="text-gray-400 space-y-2">
            <li>• You get logged out constantly</li>
            <li>• You get spammed with promos</li>
            <li>• You juggle 6 different sportsbook apps</li>
            <li>• Your bet history is buried and hard to find</li>
            <li>• Checking results requires switching apps/accounts</li>
          </ul>
        </div>

        {/* Solution Box */}
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-6 text-left mx-auto">
          <h2 className="text-xl text-white font-semibold mb-3">The Solution</h2>
          <p className="text-gray-300">
            Just share your slip to Discord.
            <br />
            BetSync automatically detects the bet and syncs it into your personal
            <span className="text-white font-semibold"> bet feed</span>.
          </p>

          <p className="text-gray-300 mt-3 font-medium">
            Clean. Unified. Automatic.
          </p>
        </div>

        {/* CTA button (optional) */}
        <div className="mt-10">
          <a
            href="/login"
            className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            Get Started
          </a>
        </div>

      </div>
    </div>
  );
}
