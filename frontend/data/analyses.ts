import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDir = path.join(process.cwd(), '../backend/data');

export type AnalysisMeta = {
  id: string;
  expertName: string;
  title: string;
  date: string;
  description: string;
  teams: string[];
  season: number;
  keywords: string[];
  canonicalUrl: string;
  image: string;
  source: string;
};

export function getAnalyses(): AnalysisMeta[] {
  const files = fs.readdirSync(dataDir);

  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const markdown = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const { data } = matter(markdown);
      return {
        id: file.replace('.md', ''),
        ...data,
      } as AnalysisMeta;
    });
}

export const analyses = getAnalyses();
