import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Tesseract from 'tesseract.js';

@Injectable()
export class BetsService {
  private readonly logger = new Logger(BetsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
  ) {}

  // Create and auto-link to game if possible
  async create(data: any) {
    let eventId = data.eventId || null;
    let eventName = data.event || 'FanDuel Slip';

    if (!eventId && data.imageUrl) {
      try {
        this.logger.log(`🧠 Running OCR on: ${data.imageUrl}`);

        const ocrText = await this.extractTextFromImage(data.imageUrl);
        this.logger.debug(`🧾 OCR Text Snippet: ${ocrText.slice(0, 100)}...`);

        const match = await this.matchGameFromText(ocrText);

        if (match) {
          eventId = match.id;
          eventName = match.name;
          this.logger.log(`✅ Matched to game: ${eventName} (${eventId})`);
        } else {
          this.logger.warn('⚠️ No matching game found in OCR text.');
        }
      } catch (err: any) {
        this.logger.error(`❌ OCR/Game matching failed: ${err.message}`);
      }
    }
return this.prisma.bet.create({
  data: {
    event: eventName,
    market: data.market || 'Pending Parse',
    stake: data.stake || 0,
    odds: data.odds || 0,
    status: data.status || 'Pending',
    imageUrl: data.imageUrl || null,
    link: data.link || null,
    eventId,
  } as any, // 👈 cast fixes Prisma strict typing
});
}

  // Extract readable text from an image using Tesseract.js
  private async extractTextFromImage(imageUrl: string): Promise<string> {
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: () => {}, // silence OCR progress logs
    });
    return result.data.text;
  }

  // Match any team names found in the OCR text to ESPN scoreboard games
  private async matchGameFromText(text: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/espn/scoreboard`;
    const res = await firstValueFrom(this.http.get(apiUrl));
    const games = res.data.events || [];
    const lowerText = text.toLowerCase();

    for (const g of games) {
      const competition = g.competitions?.[0];
      if (!competition) continue;

      const home = competition.competitors.find((c: any) => c.homeAway === 'home');
      const away = competition.competitors.find((c: any) => c.homeAway === 'away');

      if (!home || !away) continue;

      const homeName = home.team.displayName.toLowerCase();
      const awayName = away.team.displayName.toLowerCase();

      if (lowerText.includes(homeName) || lowerText.includes(awayName)) {
        return {
          id: g.id,
          name: `${away.team.displayName} @ ${home.team.displayName}`,
        };
      }
    }

    return null;
  }

  // Fetch all bets
  async findAll() {
    return this.prisma.bet.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Fetch one bet
  async findOne(id: number) {
    return this.prisma.bet.findUnique({
      where: { id },
    });
  }

  // Fetch bets for a specific event
  async findByEvent(eventId: string) {
    return this.prisma.bet.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
  }
}