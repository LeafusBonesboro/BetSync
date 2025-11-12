import { Controller, Get, Query } from '@nestjs/common';
import { NbaService } from './nba.service';

@Controller('nba')
export class NbaController {
  constructor(private readonly nbaService: NbaService) {}

  @Get('games')
  async getGames(@Query('date') date?: string) {
    return this.nbaService.fetchAndStoreGames(date);
  }
}
