import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('api/bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  // Create one bet (used by the Discord bot)
  @Post()
  async create(@Body() body: any) {
    try {
      const newBet = await this.betsService.create(body);
      return { success: true, bet: newBet };
    } catch (error) {
      console.error('Error creating bet:', error);
      return { success: false, message: 'Failed to create bet', error: error.message };
    }
  }

  // Fetch all bets (for your frontend / dashboard)
  @Get()
  async findAll() {
    return this.betsService.findAll();
  }

  // Fetch a specific bet by ID (optional)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.betsService.findOne(Number(id));
  }
}
