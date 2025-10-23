'use client';

import { useEffect, useState } from 'react';
import AnalysisCard from './components/AnalysisCard';

interface Analysis {
  id: number;
  expertName: string;
  title: string;
  summary?: string;
  markdown?: string;
  parsedData?: Record<string, any>;
}

export default function ResearchPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/analysis')
      .then((res) => res.json())
      .then(setAnalyses)
      .catch((err) => console.error('Error fetching analyses:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-amber-400 mb-8">Expert Analyses</h1>

      <div className="space-y-6">
        {analyses.length === 0 && (
          <p className="text-gray-400">No analyses yet. Upload one to get started!</p>
        )}

        {analyses.map((a) => (
          <AnalysisCard key={a.id} analysis={a} />
        ))}
      </div>
    </div>
  );
}
