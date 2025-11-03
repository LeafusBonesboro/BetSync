import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { PlayerInfo } from './types';




interface FlatStat {
  category: string;
  name: string;
  label: string;
  value: number;
}

@Injectable()
export class EspnService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getTeamStats(year: number, type = 2, teamId: number) {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${type}/teams/${teamId}/statistics`;
    try {
      const response = await firstValueFrom(this.httpService.get<any>(url));
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error instanceof Error ? error.message : String(error));
    }
  }

  async getScoreboard(year: string, week: string) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?year=${year}&week=${week}`;
    const { data } = await firstValueFrom(this.httpService.get(url));

    return data.events.map((e) => {
      const comp = e.competitions[0];
      const home = comp.competitors.find((c) => c.homeAway === 'home');
      const away = comp.competitors.find((c) => c.homeAway === 'away');
      return {
        id: e.id,
        name: e.name,
        shortName: e.shortName,
        date: e.date,
        home: home.team.displayName,
        away: away.team.displayName,
        homeScore: home.score || null,
        awayScore: away.score || null,
        status: comp.status?.type?.name,
      };
    });
  }

  async getBoxscore(eventId: string) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    console.dir(Object.keys(data), { depth: null });
    console.dir(Object.keys(data.boxscore || {}), { depth: null });

    return {
      id: eventId,
      gameInfo: data.header,
      boxscore: data.boxscore,
      leaders: data.leaders,
    };
  }

  async getTeamRoster(teamId: number): Promise<PlayerInfo[]> {
  try {
    const teamUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}`;
    const { data: teamData } = await firstValueFrom(this.httpService.get(teamUrl));

    const rosterRef = teamData.athletes?.$ref;
    if (!rosterRef) {
      console.warn(`⚠️ No athletes link for team ${teamId}`);
      return [];
    }

    let allItems: any[] = [];
let nextUrl: string | null = rosterRef;

while (nextUrl) {
  const { data } = await firstValueFrom(this.httpService.get(nextUrl));

  if (data.items?.length) {
    allItems.push(...data.items);
  }

  // ESPN uses either 'paging.next' or 'links.next'
  nextUrl =
    data?.paging?.next?.href ??
    data?.paging?.next?.$ref ??
    data?.links?.next?.href ??
    data?.links?.next?.$ref ??
    null;

  // 👇 Optional safety log to confirm pagination is chaining
  if (nextUrl) console.log(`➡️ Fetching next page: ${nextUrl}`);
}


    console.log(`📦 Retrieved ${allItems.length} athlete entries for team ${teamId}`);

    const players: PlayerInfo[] = [];
    for (const athlete of allItems) {
      try {
        const { data: detail } = await firstValueFrom(this.httpService.get(athlete.$ref));
        if (!detail?.displayName) continue;

        players.push({
          id: detail.id,
          fullName: detail.displayName,
          position: detail.position?.abbreviation ?? null,
          team: detail.team?.displayName ?? null,
        });
      } catch (err) {
        console.warn(`⚠️ Failed to fetch player ${athlete.$ref || athlete.id}: ${err.message}`);
      }
    }

    console.log(`✅ Found ${players.length} players for team ${teamId}`);
    return players;
  } catch (err) {
    console.error(`❌ Error fetching roster for team ${teamId}:`, err.message);
    return [];
  }
}






async savePlayersToDb(players: PlayerInfo[]) {
  for (const player of players) {
    try {
      await this.prisma.player.upsert({
  where: { espnId: String(player.id) }, // 👈 force string
  update: {
    fullName: player.fullName,
    position: player.position,
    team: player.team,
  },
  create: {
    espnId: String(player.id),          // 👈 force string
    fullName: player.fullName,
    position: player.position,
    team: player.team,
  },
});

    } catch (err) {
      console.warn(`⚠️ Failed to save player ${player.fullName}: ${err.message}`);
    }
  }

  console.log(`💾 Saved ${players.length} players`);
}



 async getPlayerStats(playerId: string | number) {
  const url = `https://site.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerId}`;
  const { data } = await firstValueFrom(this.httpService.get(url));
  return data.athlete?.statistics ?? [];
}


  async syncAllPlayers(year: number, teamIds: number[]) {
    const results: string[] = [];

    for (const teamId of teamIds) {
      const roster: PlayerInfo[] = await this.getTeamRoster(teamId);

      for (const player of roster) {
        try {
         const statsJson = await this.getPlayerStats(player.id);

          if (!statsJson?.splits?.categories) {
            console.warn(`⚠️ No stats found for player ${player.fullName || player.id}`);
            continue; // ⛔ skip this player
          }

          const categories = statsJson.splits.categories;


          const flatStats: FlatStat[] = [];
          for (const cat of categories) {
            for (const s of cat.stats) {
              flatStats.push({
                category: cat.name,
                name: s.name,
                label: s.displayName,
                value: s.value ?? 0,
              });
            }
          }

          const dbPlayer = await this.prisma.player.upsert({
            where: { espnId: String(player.id) },
            update: {},
            create: {
              espnId: String(player.id),
              fullName: player.fullName ?? 'Unknown',
              team: player.team ?? null,
              position: player.position ?? null,
            },
          });

          for (const stat of flatStats) {
            await this.prisma.stat.upsert({
              where: {
                playerId_season_name: {
                  playerId: dbPlayer.id,
                  season: year,
                  name: stat.name,
                },
              },
              update: { value: stat.value },
              create: {
                playerId: dbPlayer.id,
                season: year,
                category: stat.category,
                name: stat.name,
                label: stat.label,
                value: stat.value,
              },
            });
          }

          results.push(String(player.id));
} catch (err) {
  console.warn(`⚠️ Failed to fetch player ${player.id}:`, (err as Error).message);
}

      }
    }

    return { synced: results.length };
  }

  async getPlayers(team?: string, position?: string) {
    return this.prisma.player.findMany({
      where: {
        team: team || undefined,
        position: position || undefined,
      },
      include: { stats: true },
    });
  }
}
