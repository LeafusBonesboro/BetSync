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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  // ⭐ Create bet from Discord bot (no auth)
  @Post()
  async createFromDiscord(@Body() data: any) {
    return this.betsService.createFromDiscord(data);
  }

  // ⭐ Get all bets for current user
  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getMyBets(@Req() req) {
    return this.betsService.findByUser(req.user.userId);
  }

  // ⭐ Get one bet by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.betsService.findOne(Number(id)); // 🔥 FIX: pass ID correctly
  }

  // ⭐ Delete bet
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.betsService.delete(Number(id)); // 🔥 FIX
  }
}
