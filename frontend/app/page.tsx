"use client";
import UploadSlip from "../components/UploadSlip";
import LoadBets from "../components/LoadBets";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-10 p-8">
      <h1 className="text-4xl font-bold text-blue-400">BetSync</h1>
      <UploadSlip />
      <LoadBets />
    </main>
  );
}
