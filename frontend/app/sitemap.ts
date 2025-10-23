

export default async function sitemap() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analysis`, { cache: 'no-store' });
  const analyses = await res.json();

  return analyses.map((a: any) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/research/${a.id}`,
    lastModified: a.date,
  }));
}