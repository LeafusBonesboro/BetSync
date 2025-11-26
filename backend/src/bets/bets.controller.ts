import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { SupabaseAuthGuard } from '../auth/supabase.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  /**
   * Discord bot creates bets (no auth)
   */
  @Post()
  async createFromDiscord(@Body() data: any) {
    return this.betsService.createFromDiscord(data);
  }

  /**
   * Authenticated user retrieves their own bets
   * req.user.id = Supabase Auth user ID
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('by-user')
  async getMyBets(@Req() req) {
    const authUserId = req.user.id; // clarity
    return this.betsService.findByUser(authUserId);
  }

  /**
   * Get a single bet belonging to authenticated user
   */
  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const authUserId = req.user.id;
    return this.betsService.findOne(Number(id), authUserId);
  }

  /**
   * Delete a bet belonging to authenticated user
   */
  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const authUserId = req.user.id;
    return this.betsService.delete(Number(id), authUserId);
  }
}
