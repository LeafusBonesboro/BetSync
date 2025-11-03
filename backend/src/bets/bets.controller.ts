import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  // 🟢 Create a bet (used by Discord bot or OCR)
  @Post()
  async create(@Body() body: any) {
    try {
      const newBet = await this.betsService.create(body);
      return { success: true, bet: newBet };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return { success: false, message: 'Failed to create bet', error: error.message };
      }
      return { success: false, message: 'Failed to create bet', error: String(error) };
    }
  }

  // 🟢 Fetch all bets
  @Get()
  async findAll() {
    return this.betsService.findAll();
  }

  // 🟢 Fetch specific bet by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.betsService.findOne(Number(id));
  }

  // 🟢 Fetch bets for a specific game
  @Get('game/:eventId')
  async findByGame(@Param('eventId') eventId: string) {
    return this.betsService.findByEvent(eventId);
  }
}