import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownCard({ markdown }: { markdown?: string }) {
  if (!markdown || markdown.trim() === '') {
    return (
      <p className="text-gray-400 italic text-center mt-8">
        No analysis content found.
      </p>
    );
  }

  return (
    <div className="prose prose-invert max-w-none bg-gray-900 p-6 rounded-xl shadow-lg">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
