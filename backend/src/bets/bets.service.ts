import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BetsService {
  constructor(private prisma: PrismaService) {}

  // Create a single bet
  async create(data: any) {
    return this.prisma.bet.create({
      data: {
        event: data.event || 'FanDuel Slip',
        market: data.market || 'Pending Parse',
        stake: data.stake || 0,
        odds: data.odds || 0,
        status: data.status || 'Pending',
        imageUrl: data.imageUrl || null,
        link: data.link || null,
      },
    });
  }

  // (Optional) create multiple bets at once — useful if you ever import many
  async createMany(bets: any[]) {
    return this.prisma.bet.createMany({
      data: bets,
    });
  }

  // Get all bets
  async findAll() {
    return this.prisma.bet.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single bet by ID (useful for frontend or API testing)
  async findOne(id: number) {
    return this.prisma.bet.findUnique({
      where: { id },
    });
  }
}
