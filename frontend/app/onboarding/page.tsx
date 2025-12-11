// app/onboarding/page.tsx
"use client";

export default function OnboardingPage() {
  const BOT_ID = "YOUR_BOT_ID";

  return (
    <div className="min-h-screen w-full bg-[#0d0d11] flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Set up your BetSync in 10 seconds
        </h1>

        <p className="text-gray-300 mt-6 text-lg">
          BetSync uses Discord’s built-in sharing system.  
          To enable syncing, just send our bot one message.
        </p>

        {/* Step Box */}
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-10 text-left mx-auto">
          <h2 className="text-xl text-white font-semibold mb-4">
            Step 1 — Message the Bot
          </h2>
          <p className="text-gray-300 mb-4">
            Tap below and send the bot anything (even “hi”).  
            This makes it appear in your Sportsbook’s Share menu.
          </p>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://discord.com/users/${BOT_ID}`}
            className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Message the BetSync Bot
          </a>
        </div>

        {/* Step 2 */}
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-6 text-left mx-auto">
          <h2 className="text-xl text-white font-semibold mb-4">
            Step 2 — Share Your First Bet
          </h2>
          <p className="text-gray-300">
            Open a bet slip → tap <b>Share</b> → choose <b>Discord</b> → pick
            <b>BetSync Bot</b>.  
            Your bet will sync instantly.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-6 mt-6 text-left mx-auto">
          <h2 className="text-xl text-white font-semibold mb-4">
            Step 3 — Refresh Your Dashboard
          </h2>
          <p className="text-gray-300">
            Your shared slip appears in your feed automatically.
          </p>
        </div>

        <a
          href="/bets"
          className="inline-block mt-10 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition"
        >
          Go to Dashboard
        </a>

      </div>
    </div>
  );
}
