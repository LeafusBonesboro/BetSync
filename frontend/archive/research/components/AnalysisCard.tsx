'use client';

import Link from 'next/link';

interface Props {
  analysis: {
    id: number;
    expertName: string;
    title: string;
    summary?: string;
  };
}

export default function AnalysisCard({ analysis }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:border-amber-400 transition">
      <h2 className="text-2xl font-bold text-white mb-2">{analysis.title}</h2>
      <p className="text-gray-400 mb-4">{analysis.summary}</p>
      <div className="text-sm text-gray-500">
        By {analysis.expertName}
      </div>
      <Link
        href={`/research/${analysis.id}`}
        className="text-amber-400 hover:text-amber-300 text-sm font-semibold mt-3 block"
      >
        Read Full Analysis →
      </Link>
    </div>
  );
}
