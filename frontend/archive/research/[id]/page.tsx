import MarkdownCard from '../components/MarkdownCard';

export default async function AnalysisDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // ✅ unwrap the Promise safely

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const SITE_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${API_BASE}/analysis/${id}`, { cache: 'no-store' });
  const analysis = await res.json();



  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-amber-400 mb-4">{analysis.title}</h1>
      <p className="text-gray-400 mb-8">
        {analysis.expertName} —{' '}
        {analysis.date
          ? new Date(analysis.date).toLocaleDateString()
          : 'No date available'}
      </p>

      <MarkdownCard markdown={analysis.markdown} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: analysis.title,
            description: analysis.description,
            author: { "@type": "Person", name: analysis.expertName },
            datePublished: analysis.date,
            image: analysis.image,
            mainEntityOfPage: `${SITE_BASE}/research/${id}`,
          }),
        }}
      />
    </div>
  );
}
