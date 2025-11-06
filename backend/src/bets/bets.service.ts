import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BetsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BetCreateInput) {
    return this.prisma.bet.create({ data });
  }

  async findAll() {
    return this.prisma.bet.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.bet.findUnique({ where: { id } });
  }

  async delete(id: number) {
    return this.prisma.bet.delete({ where: { id } });
  }
}
