import { Controller, Get, Query } from '@nestjs/common';
import { EspnService } from './espn.service';

@Controller('espn')
export class EspnController {
  constructor(private readonly espnService: EspnService) {}

  @Get('team-stats')
  async getTeamStats(
    @Query('year') year: number,
    @Query('teamId') teamIds: string, // can be "16,24"
  ) {
    const ids = teamIds.split(',').map((id) => parseInt(id, 10));
    const promises = ids.map((id) => this.espnService.getTeamStats(year, 2, id));
    const results = await Promise.all(promises);
    return results;
  }
}
