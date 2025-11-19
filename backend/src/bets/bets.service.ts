import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BetsGateway } from './bets.gateway';

@Injectable()
export class BetsService {
  constructor(
    private prisma: PrismaService,
    private gateway: BetsGateway,   // ⭐ inject gateway
  ) {}

  async createFromDiscord(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { discordId: data.discordId },
    });

    if (!user) {
      throw new BadRequestException(`No user found with discordId: ${data.discordId}`);
    }

    const bet = await this.prisma.bet.create({
      data: {
        event: data.event,
        market: data.market,
        stake: data.stake,
        odds: data.odds,
        status: data.status,
        imageUrl: data.imageUrl,
        link: data.link,
        rawText: data.rawText,
        userId: user.id,
      },
    });

    // ⭐ Send real-time update to frontend
    this.gateway.emitNewBet(user.id, bet);

    return bet;
  }

  async findByUser(userId: string) {
    return this.prisma.bet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.bet.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async delete(id: number) {
    return this.prisma.bet.delete({ where: { id } });
  }
}
