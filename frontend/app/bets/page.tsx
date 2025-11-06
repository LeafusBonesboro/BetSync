import BetsList from "@/components/BetsList";

export default function BetsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Your Bets</h1>
      <BetsList />
    </main>
  );
}
