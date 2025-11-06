'use client';

import { Suspense } from 'react';
import Scoreboard from '@/components/Scoreboard';

export default function ScoreboardPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading scoreboard...</p>}>
      <Scoreboard />
    </Suspense>
  );
}
