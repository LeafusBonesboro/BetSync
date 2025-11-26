import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

@Injectable()
export class AnalysisService {
  private readonly analysesDir = path.join(process.cwd(), 'data', 'analyses');


  // Get all metadata for list view
  getAll() {
    const files = fs.readdirSync(this.analysesDir);

    return files.map((file) => {
      const filePath = path.join(this.analysesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      return {
        id: file.replace('.md', ''),
        ...data,
      };
    });
  }

  // Get one article including markdown
  getOne(id: string) {
    const filePath = path.join(this.analysesDir, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Analysis not found: ${id}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);

    return {
      id,
      title: frontMatter.title,
      expertName: frontMatter.expertName,
      date: frontMatter.date,
      description: frontMatter.description,
      markdown: content, // 👈 the actual markdown body
    };
  }
}
