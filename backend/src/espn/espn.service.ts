import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EspnService {
  constructor(private readonly httpService: HttpService) {}

  async getTeamStats(year: number, type = 2, teamId: number) {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${type}/teams/${teamId}/statistics`;

    try {
      const response = await firstValueFrom(this.httpService.get<any>(url));
      return response.data;
    } catch (error) {
      console.error('Error fetching ESPN data:', error.message);
      throw new Error('Failed to fetch team statistics from ESPN API.');
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
      status: comp.status?.type?.name, // e.g. 'STATUS_SCHEDULED', 'STATUS_IN_PROGRESS', 'STATUS_FINAL'
    };
  });
}



  // 🆕 ESPN boxscore: get full game stats for a specific event
  async getBoxscore(eventId: string) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return {
      id: eventId,
      gameInfo: data.header,
      boxscore: data.boxscore,
      leaders: data.leaders,
    };
  }
}
