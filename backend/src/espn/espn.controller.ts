import { Controller, Get, Query, Param } from '@nestjs/common';
import { EspnService } from './espn.service';
import { PlayerInfo } from './types';


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

    // 🆕 get all players for a team
    @Get('team/:teamId/roster')
    async getTeamRoster(@Param('teamId') teamId: string) {
      return this.espnService.getTeamRoster(parseInt(teamId, 10));
    }

    // 🆕 get single player stats
    @Get('player/:playerId')
    async getPlayerStats(@Param('playerId') playerId: string) {
      return this.espnService.getPlayerStats(playerId);
    }

    // 🆕 sync all players for selected teams
@Get('sync-all')
async syncAll() {
  console.log('🔁 Starting full ESPN sync...');
  const teamIds = Array.from({ length: 32 }, (_, i) => i + 1);
  const result = await this.espnService.syncAllPlayers(2025, teamIds);
  console.log(`🎉 Sync complete. Synced ${result.synced} players`);
  return result;
}


    @Get('players')
  async getPlayers(
    @Query('team') team?: string,
    @Query('position') position?: string,
  ) {
    return this.espnService.getPlayers(team, position);
  }
}
