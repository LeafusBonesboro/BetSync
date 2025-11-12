import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NbaService {
  private readonly logger = new Logger(NbaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchAndStoreGames(date?: string) {
    const fetch = (await import('node-fetch')).default;

    // ESPN expects YYYYMMDD format
    const formattedDate = date
      ? date.replace(/-/g, '')
      : new Date().toISOString().split('T')[0].replace(/-/g, '');

    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${formattedDate}`;
    const res = await fetch(url);
    const data = (await res.json()) as any;

    if (!data?.events) {
      this.logger.warn(`No NBA games found for date ${formattedDate}`);
      return [];
    }

    // 🧩 Fix ESPN abbreviation inconsistencies for team logos
    const fixAbbr = (abbr: string | null): string | null => {
      if (!abbr) return null;
      const map: Record<string, string> = {
        SA: 'sas',
        NY: 'nyk',
        GS: 'gsw',
        NO: 'nop',
        WAS: 'wsh',
        PHX: 'phx',
        UTA: 'uta',
        OKC: 'okc',
        // Add others if ESPN ever changes abbreviations
      };
      return map[abbr] || abbr.toLowerCase();
    };

    const games = data.events.map((e: any) => {
      const comp = e.competitions?.[0];
      const odds = comp?.odds?.[0];
      const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
      const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');

      const homeAbbr = home?.team?.abbreviation ?? null;
      const awayAbbr = away?.team?.abbreviation ?? null;

      // 🏀 ESPN static logo URLs
      const homeLogo = homeAbbr
        ? `https://a.espncdn.com/i/teamlogos/nba/500/${fixAbbr(homeAbbr)}.png`
        : 'https://a.espncdn.com/i/teamlogos/nba/500/nba.png';

      const awayLogo = awayAbbr
        ? `https://a.espncdn.com/i/teamlogos/nba/500/${fixAbbr(awayAbbr)}.png`
        : 'https://a.espncdn.com/i/teamlogos/nba/500/nba.png';

      return {
        espnId: e.id,
        homeTeam:
          home?.team?.displayName ?? home?.team?.shortDisplayName ?? 'Unknown',
        awayTeam:
          away?.team?.displayName ?? away?.team?.shortDisplayName ?? 'Unknown',
        homeAbbr,
        awayAbbr,
        homeLogo,
        awayLogo,
        homeScore: parseInt(home?.score ?? 0),
        awayScore: parseInt(away?.score ?? 0),
        status: comp?.status?.type?.shortDetail ?? 'Scheduled',
        startTime: new Date(e.date),
        spread: odds?.details
          ? parseFloat(odds.details.replace(/[^\d.-]/g, ''))
          : 0,
        total: odds?.overUnder ? parseFloat(odds.overUnder) : 0,
        moneylineHome: odds?.homeTeamOdds?.moneyLine ?? 0,
        moneylineAway: odds?.awayTeamOdds?.moneyLine ?? 0,
      };
    });

    // 🧠 Upsert each game into Prisma
    for (const g of games) {
      try {
        await this.prisma.nbaGame.upsert({
          where: { espnId: g.espnId },
          update: g,
          create: g,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`⚠️ Failed to save game ${g.espnId}: ${message}`);
      }
    }

    this.logger.log(`✅ Synced ${games.length} NBA games for ${formattedDate}.`);
    return games;
  }
}
