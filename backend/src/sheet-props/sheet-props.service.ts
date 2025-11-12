import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SheetsService } from '../sheets/sheets.service';

@Injectable()
export class SheetPropsService {
  private readonly logger = new Logger(SheetPropsService.name);
  private readonly range = 'Sheet1!A2:D';

  constructor(
    private readonly prisma: PrismaService,
    private readonly sheets: SheetsService,
  ) {}

  async syncFromSheet() {
    const rows = await this.sheets.read(this.range);

    if (!rows || rows.length === 0) {
      this.logger.warn('No rows found in Google Sheet.');
      return { message: 'No data found in sheet' };
    }

    for (let i = 0; i < rows.length; i++) {
  const [betSlip, odds, game, propText] = rows[i];
  if (!betSlip || !propText) continue;

  const betId = Number(betSlip);
  const sheetRow = i + 2;

  // Split prop text into playerName + description if possible
  let playerName = 'Unknown Player';
  let description = propText.trim();

  if (propText.includes(':')) {
    const parts = propText.split(':').map((s) => s.trim());
    playerName = parts[0] || playerName;
    description = parts[1] || description;
  } else {
    playerName = propText.trim();
    description = propText.trim(); // fallback same as name
  }

  const bet = await this.prisma.bet.upsert({
    where: { id: betId },
    update: {
      odds: Number(odds) || 0,
      event: game || 'Unknown',
      market: 'Parlay',
    },
    create: {
      id: betId,
      event: game || 'Unknown',
      market: 'Parlay',
      stake: 0,
      odds: Number(odds) || 0,
    },
  });

  await this.prisma.betProp.upsert({
    where: { betId_description: { betId: bet.id, description } },
    update: { sheetRow },
    create: {
      betId: bet.id,
      playerName,
      description,
      outcome: 'Pending',
      sheetRow,
    },
  });
}

    this.logger.log(`✅ Synced ${rows.length} rows from Google Sheet.`);
    return { message: `Synced ${rows.length} rows` };
  }
}
