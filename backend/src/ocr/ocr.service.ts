// src/ocr/ocr.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { ParsedBetDto } from '../bets/dto/parsed-bet.dto';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  async processImageFromUrl(imageUrl: string): Promise<ParsedBetDto> {
    const fetch = (await import('node-fetch')).default;
    const { v4: uuidv4 } = await import('uuid');

    // 📥 Download image
    this.logger.log(`📥 Downloading image from: ${imageUrl}`);
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());

    // 💾 Save temp image
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    await mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, `${uuidv4()}.png`);
    await writeFile(filePath, buffer);
    this.logger.log(`💾 Saved: ${filePath}`);

    // 🧠 Run OCR
    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => this.logger.debug(JSON.stringify(m)),
    });

    const rawText = result.data.text.trim();
this.logger.debug(`📄 OCR Raw Text:\n${rawText}`);

// 🧠 Smarter line handling
const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean).filter(l => l.length > 2);

// 🔍 Match components with fallbacks
const playerMatch = rawText.match(/^[A-Z][a-z]+\s[A-Z][a-z]+/); // e.g. Myles Turner
const marketMatch = rawText.match(/TO SCORE.*POINTS/i);        // e.g. TO SCORE 10+ POINTS
const oddsMatch = rawText.match(/[-+]\d{2,4}/);
const stakeMatch = rawText.match(/\$\d+\.\d{2}/);
const payoutMatch = rawText.match(/RETURNED.*\$\d+\.\d{2}/);
const teams = rawText.match(/New York Knicks|Milwaukee Bucks|[\w ]+ vs [\w ]+/gi);
const betIdMatch = rawText.match(/BET ID[: ]+([\d/]+)/i);
const placedMatch = rawText.match(/PLACED[: ]+([0-9/:\sAPM]+)/i);

// Extract basic fields
const stake = stakeMatch ? parseFloat(stakeMatch[0].replace(/[^0-9.]/g, '')) : 0;
const payout = payoutMatch ? parseFloat(payoutMatch[0].match(/\$\d+\.\d{2}/)?.[0].replace('$', '') || '0') : 0;
const resultStatus = payout > 0 ? 'Won' : 'Lost';
const odds = oddsMatch ? parseInt(oddsMatch[0]) : 0;
const market = marketMatch?.[0] || 'Unknown Market';
const betId = betIdMatch?.[1] || '00000000';
const placedAt = placedMatch ? new Date(placedMatch[1]).toISOString() : new Date().toISOString();

// 👥 Event line
let team = 'Unknown';
let opponent = 'Unknown';
let event = 'Unknown Event';

const vsLine = lines.find(l => / vs /i.test(l));
if (vsLine) {
  const parts = vsLine.split(/ vs /i);
  if (parts.length === 2) {
    [team, opponent] = parts;
    event = `${team} vs ${opponent}`;
  }
} else if (teams && teams.length >= 2) {
  team = teams[0].trim();
  opponent = teams[1].trim();
  event = `${team} vs ${opponent}`;
}
 else {
  // fallback to first few lines if totally broken
  team = lines[0] || 'Unknown';
  opponent = lines[1] || 'Unknown';
  event = `${team} vs ${opponent}`;
}

const parsed: ParsedBetDto = {
  event,
  market,
  odds,
  stake,
  payout,
  result: resultStatus as 'Won' | 'Lost' | 'Pending',
  team,
  opponent,
  teamScore: 0,
  opponentScore: 0,
  betId,
  placedAt,
  rawText,
};


    this.logger.log('✅ OCR parsing successful.');
    return parsed;
  }
}
