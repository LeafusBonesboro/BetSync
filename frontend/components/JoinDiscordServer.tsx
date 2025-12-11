"use client";

export default function JoinDiscordServer() {
  const inviteUrl = process.env.NEXT_PUBLIC_DISCORD_SERVER;

  const handleClick = () => {
    if (!inviteUrl) {
      console.error("❌ Missing NEXT_PUBLIC_DISCORD_SERVER in .env");
      return;
    }

    window.open(inviteUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
    >
      Join Discord Server
    </button>
  );
}
