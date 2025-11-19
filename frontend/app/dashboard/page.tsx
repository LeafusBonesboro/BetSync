"use client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F] text-white">
      {/* Header */}
      <header className="bg-linear-to-b from-[#123C8C] to-[#0B0B0F] px-4 pt-10 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="w-10 h-10 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center">
            U
          </div>

          <div className="flex gap-3 items-center">
            {/* Notification icon placeholder */}
            <div className="text-white/80">🔔</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#1A1F2E] flex items-center rounded-full px-4 py-2 text-gray-400 text-sm">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
          />
        </div>
      </header>

      {/* Quick Actions */}
      <section className="flex justify-around px-4 mt-6">
        {[
          { label: "Invite", icon: "😊" },
          { label: "Discover", icon: "🧭" },
          { label: "Calendar", icon: "🗓️" },
          { label: "Your Bets", icon: "📋" },
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

      {/* Feed Placeholder */}
      <section className="px-4 mt-6 flex-1 overflow-y-auto pb-24">
        <h2 className="text-lg font-semibold mb-4">Feed</h2>

        <div className="bg-[#111520] border border-gray-800 rounded-xl p-4 text-gray-400 text-sm">
          Feed content coming soon...
        </div>
      </section>
    </div>
  );
}
