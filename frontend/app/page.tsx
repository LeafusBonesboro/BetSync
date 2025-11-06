"use client";

import LoadBets from "../components/LoadBets";
import BetsList from "../components/BetsList";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-10 p-8">
      <h1 className="text-4xl font-bold text-blue-400">BetSync</h1>
     
      <BetsList/>
    </main>
  );
}
