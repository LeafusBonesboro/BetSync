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
}
