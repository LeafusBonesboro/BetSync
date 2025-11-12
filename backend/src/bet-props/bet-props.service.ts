import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BetPropsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all bet props (with their linked bets)
   */
  async findAll() {
    return this.prisma.betProp.findMany({
      include: {
        bet: true,
      },
      orderBy: { sheetRow: 'asc' },
    });
  }

  /**
   * Get bet props for a specific game by eventId
   */
  async findByEventId(eventId: string) {
    return this.prisma.betProp.findMany({
      where: {
        bet: {
          eventId, // ✅ this exists on Bet
        },
      },
      include: {
        bet: true,
      },
      orderBy: { sheetRow: 'asc' },
    });
  }

  /**
   * Create a new bet prop
   */
  async create(data: {
    betId: number;
    playerName: string;
    description: string;
    line?: number;
    sheetRow?: number;
  }) {
    return this.prisma.betProp.create({
      data,
    });
  }

  /**
   * Update outcome or current stat for a bet prop
   */
  async update(id: number, data: Partial<{ outcome: string; currentStat: number }>) {
    return this.prisma.betProp.update({
      where: { id },
      data,
    });
  }
}
