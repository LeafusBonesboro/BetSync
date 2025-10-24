import { Injectable, Logger } from '@nestjs/common';
import { EspnService } from '../espn/espn.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser'; // ✅ must use * as for tsc types
import Tesseract from 'tesseract.js'; // ✅ simpler than createWorker()

@Injectable()
export class BetParserService {
  private readonly logger = new Logger(BetParserService.name);

  constructor(private readonly espnService: EspnService) {}

  /**
   * Parse an image (e.g., FanDuel slip screenshot)
   */
  async parseImage(imageUrl: string) {
    this.logger.log(`🖼️ Parsing image: ${imageUrl}`);

    // ✅ simpler API: no loadLanguage/initialize needed
    const { data } = await Tesseract.recognize(imageUrl, 'eng');
    this.logger.debug(`Extracted text: ${data.text.substring(0, 100)}...`);

    const eventMatch = data.text.match(/Vikings|Chargers|Chiefs|Eagles/i);
    const eventName = eventMatch ? eventMatch[0] : 'Unknown';

    return {
      type: 'image',
      event: eventName,
      rawText: data.text,
    };
  }

  /**
   * Parse a CSV file of bets
   */
  async parseCsv(filePath: string) {
    this.logger.log(`📄 Parsing CSV: ${filePath}`);
    const results: Record<string, any>[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.default()) // ✅ correct type-safe call
        .on('data', (row: Record<string, any>) => results.push(row)) // ✅ typed
        .on('end', () => {
          this.logger.log(`Parsed ${results.length} bets from CSV`);
          resolve(results);
        })
        .on('error', reject);
    });
  }

  /**
   * Cross-check parsed bets with ESPN game data
   */
  /**
 * Cross-check parsed bets with ESPN game data
 */
async linkToEvent(parsedText: string) {
  const currentYear = new Date().getFullYear().toString();
  const currentWeek = '1'; // or dynamically get NFL week later

  const games = await this.espnService.getScoreboard(currentYear, currentWeek);

  const match = games.find((g: any) =>
    parsedText.toLowerCase().includes(g.homeTeam.toLowerCase()) ||
    parsedText.toLowerCase().includes(g.awayTeam.toLowerCase())
  );

  return match ? match.id : null;
}

}
