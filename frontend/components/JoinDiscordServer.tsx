"use client";

export default function JoinDiscordServer() {
  const invite = process.env.NEXT_PUBLIC_DISCORD_SERVER;

  return (
    <a
      href={invite}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition shadow"
    >
      Join Discord Server
    </a>
  );
}
