import { Controller, Get, Query, Param } from '@nestjs/common';
import { EspnService } from './espn.service';

@Controller('espn')
export class EspnController {
  constructor(private readonly espnService: EspnService) {}

  // existing route — keep this
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

  // 🆕 NEW: get scoreboard (weekly games list)
  @Get('scoreboard')
  async getScoreboard(
    @Query('year') year: string,
    @Query('week') week: string,
  ) {
    return this.espnService.getScoreboard(year, week);
  }

  // 🆕 NEW: get boxscore for a specific gameId/eventId
  @Get('boxscore/:eventId')
  async getBoxscore(@Param('eventId') eventId: string) {
    return this.espnService.getBoxscore(eventId);
  }
}
